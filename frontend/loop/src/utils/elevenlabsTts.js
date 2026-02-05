/**
 * Play TTS via the parent app's /api/tts (ElevenLabs).
 * When the loop runs in an iframe, uses parent origin so /api/tts hits the Next.js app.
 * Falls back to browser speechSynthesis if the API fails (e.g. no API key or network error).
 * @param {string} text - Text to speak
 * @param {{ signal?: AbortSignal }} [options] - Optional AbortSignal to cancel request/playback
 * @returns {Promise<void>} Resolves when playback finishes or rejects on error/cancel
 */
export function playElevenLabsTts(text, options = {}) {
  const { signal } = options;
  // Use current origin so /api/tts hits the same host (Next app when loop is at /loop/index.html)
  const apiBase = typeof window !== "undefined" ? window.location.origin : "";

  let currentAudio = null;
  const onAbort = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (signal) signal.removeEventListener("abort", onAbort);
    reject(new DOMException("Aborted", "AbortError"));
  };

  function fallbackBrowserTts() {
    if (typeof window === "undefined" || !window.speechSynthesis) return Promise.resolve();
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.1;
      u.pitch = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.name.includes("Samantha") ||
          v.name.includes("Karen") ||
          v.name.includes("Victoria") ||
          (v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
      );
      if (preferred) u.voice = preferred;
      else {
        const en = voices.find((v) => v.lang.startsWith("en"));
        if (en) u.voice = en;
      }
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    if (signal) signal.addEventListener("abort", onAbort);

    const url = `${apiBase}/api/tts`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal,
      mode: "cors",
    })
      .then((res) => {
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok) {
          return res.json().then((d) => Promise.reject(new Error(d.error || d.details || res.statusText)));
        }
        if (!contentType.includes("audio/mpeg") && !contentType.includes("audio/mp3")) {
          return res.text().then((t) => Promise.reject(new Error("Response was not audio")));
        }
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (signal?.aborted) return;
        const blob = new Blob([buffer], { type: "audio/mpeg" });
        const objectUrl = URL.createObjectURL(blob);
        const audio = new Audio(objectUrl);
        currentAudio = audio;

        const cleanup = () => {
          currentAudio = null;
          URL.revokeObjectURL(objectUrl);
          if (signal) signal.removeEventListener("abort", onAbort);
        };

        audio.onended = () => {
          cleanup();
          resolve();
        };
        audio.onerror = () => {
          cleanup();
          fallbackBrowserTts().then(resolve);
        };

        audio.play().catch(() => {
          cleanup();
          fallbackBrowserTts().then(resolve);
        });
      })
      .catch((err) => {
        if (signal) signal.removeEventListener("abort", onAbort);
        if (typeof console !== "undefined" && console.warn) {
          console.warn("TTS (ElevenLabs) failed, using browser speech:", err?.message || err);
        }
        fallbackBrowserTts().then(resolve).catch(reject);
      });
  });
}
