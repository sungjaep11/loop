/**
 * Play TTS via the parent app's /api/tts (ElevenLabs).
 * Requests are queued so only one runs at a time (avoids 429 "too many concurrent requests").
 * Uses Web Audio API when available (unlocked by user gesture) so playback is not blocked by autoplay policy.
 * @param {string} text - Text to speak
 * @param {{ signal?: AbortSignal, voiceId?: string }} [options] - Optional AbortSignal and optional ElevenLabs voice ID override
 * @returns {Promise<void>} Resolves when playback finishes or rejects on error/cancel
 */

import { getTtsAudioContext } from "../stores/audioStore";

const ttsQueue = [];
let ttsBusy = false;
let currentPlayingText = null; // avoid duplicate requests for same text

function getTtsOrigin() {
  if (typeof window === "undefined") return "";
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_TTS_ORIGIN) {
    return String(import.meta.env.VITE_TTS_ORIGIN).replace(/\/$/, "");
  }
  if (window.top !== window.self) {
    try {
      if (window.top?.location?.origin) return window.top.location.origin;
    } catch (_) {}
  }
  return window.location.origin;
}

function fallbackBrowserTts(text) {
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

function playWithHtmlAudio(buffer, text, signal, resolve, cleanup, onAbort, setCurrentAudio) {
  const blob = new Blob([buffer], { type: "audio/mpeg" });
  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);
  if (typeof setCurrentAudio === "function") setCurrentAudio(audio);

  const cleanupHtml = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    URL.revokeObjectURL(objectUrl);
    if (typeof setCurrentAudio === "function") setCurrentAudio(null);
    cleanup();
  };

  audio.onended = () => {
    cleanupHtml();
    resolve();
  };
  audio.onerror = () => {
    if (typeof console !== "undefined" && console.warn) {
      console.warn("[TTS] Audio element error, using browser speech");
    }
    cleanupHtml();
    fallbackBrowserTts(text).then(resolve);
  };

  const tryPlay = () => {
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.catch((err) => {
        const isBlocked = err?.name === "NotAllowedError" || /not allowed|user gesture|interact/i.test(String(err?.message || ""));
        if (isBlocked && typeof window !== "undefined") {
          if (typeof console !== "undefined" && console.warn) {
            console.warn("[TTS] Autoplay blocked. Click anywhere to hear V.E.R.A.");
          }
          const retry = () => {
            window.removeEventListener("click", retry);
            window.removeEventListener("keydown", retry);
            window.removeEventListener("touchstart", retry);
            if (signal?.aborted) return;
            audio.play().then(() => {}).catch(() => {
              cleanupHtml();
              fallbackBrowserTts(text).then(resolve);
            });
          };
          window.addEventListener("click", retry, { once: true });
          window.addEventListener("keydown", retry, { once: true });
          window.addEventListener("touchstart", retry, { once: true });
          return;
        }
        cleanupHtml();
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[TTS] audio.play() failed, using browser speech:", err?.message || err);
        }
        fallbackBrowserTts(text).then(resolve);
      });
    }
  };
  tryPlay();
}

/**
 * Run a single TTS request (fetch + play). Used by the queue.
 */
function runOneTts(text, options) {
  const { signal, voiceId } = options;
  const origin = getTtsOrigin();
  const url = origin ? `${origin}/api/tts` : "/api/tts";

  let currentAudio = null; // HTML Audio element or Web Audio BufferSource

  return new Promise((resolve, reject) => {
    const onAbort = () => {
      if (currentAudio) {
        if (currentAudio.pause) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        } else if (currentAudio.stop) {
          try {
            currentAudio.stop(0);
          } catch (_) {}
        }
        currentAudio = null;
      }
      if (signal) signal.removeEventListener("abort", onAbort);
      reject(new DOMException("Aborted", "AbortError"));
    };

    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    if (signal) signal.addEventListener("abort", onAbort);

    const body = typeof voiceId === "string" && voiceId.trim() ? { text, voiceId: voiceId.trim() } : { text };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
      mode: "cors",
    })
      .then((res) => {
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok) {
          return res
            .text()
            .then((t) => {
              let details = t;
              try {
                const d = JSON.parse(t);
                details = d.error || d.details || t;
              } catch (_) {}
              if (typeof console !== "undefined" && console.error) {
                console.error("[TTS] API error", res.status, url, details);
              }
              return Promise.reject(new Error(details || res.statusText));
            });
        }
        if (!contentType.includes("audio/mpeg") && !contentType.includes("audio/mp3")) {
          if (typeof console !== "undefined" && console.error) {
            console.error("[TTS] Response was not audio", contentType, url);
          }
          return res.text().then((t) => Promise.reject(new Error("Response was not audio")));
        }
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (signal?.aborted) return;

        const cleanup = () => {
          currentAudio = null;
          if (signal) signal.removeEventListener("abort", onAbort);
        };

        // Prefer Web Audio API so playback works without a new user gesture (context already unlocked by initAudio)
        const ctx = typeof getTtsAudioContext === "function" ? getTtsAudioContext() : null;
        if (ctx) {
          ctx.decodeAudioData(buffer.slice(0), (decoded) => {
            if (signal?.aborted) return;
            const source = ctx.createBufferSource();
            source.buffer = decoded;
            source.connect(ctx.destination);
            currentAudio = source;
            source.onended = () => {
              cleanup();
              resolve();
            };
            try {
              source.start(0);
              if (typeof console !== "undefined" && console.log) {
                console.log("[TTS] Playing ElevenLabs audio (Web Audio)");
              }
            } catch (e) {
              cleanup();
              if (typeof console !== "undefined" && console.warn) {
                console.warn("[TTS] Web Audio start failed, using HTML Audio:", e?.message);
              }
              playWithHtmlAudio(buffer, text, signal, resolve, cleanup, onAbort, (a) => { currentAudio = a; });
            }
          }, (err) => {
            if (typeof console !== "undefined" && console.warn) {
              console.warn("[TTS] decodeAudioData failed, using HTML Audio:", err?.message);
            }
            playWithHtmlAudio(buffer, text, signal, resolve, cleanup, onAbort, (a) => { currentAudio = a; });
          });
          return;
        }

        playWithHtmlAudio(buffer, text, signal, resolve, cleanup, onAbort, (a) => { currentAudio = a; });
      })
      .catch((err) => {
        if (signal) signal.removeEventListener("abort", onAbort);
        if (err?.name === "AbortError") {
          reject(err);
          return;
        }
        if (typeof console !== "undefined") {
          const msg = err?.message || String(err);
          console.error("[TTS] ElevenLabs failed, using browser speech. URL:", url, "Error:", msg);
          if (/not set|API key|ELEVENLABS/i.test(msg)) {
            console.error("[TTS] Fix: set ELEVENLABS_API_KEY in frontend/.env and restart the Next dev server (npm run dev).");
          }
        }
        fallbackBrowserTts(text).then(resolve).catch(reject);
      });
  });
}

function processTtsQueue() {
  if (ttsBusy || ttsQueue.length === 0) return;

  const item = ttsQueue.shift();
  if (item.signal?.aborted) {
    item.reject(new DOMException("Aborted", "AbortError"));
    processTtsQueue();
    return;
  }

  ttsBusy = true;
  currentPlayingText = item.text;
  runOneTts(item.text, { signal: item.signal, voiceId: item.voiceId })
    .then(() => {
      item.resolve();
    })
    .catch((err) => {
      item.reject(err);
    })
    .finally(() => {
      ttsBusy = false;
      currentPlayingText = null;
      processTtsQueue();
    });
}

export function playElevenLabsTts(text, options = {}) {
  const { signal, voiceId } = options;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const trimmed = typeof text === "string" ? text.trim() : "";
    if (!trimmed) {
      resolve();
      return;
    }

    // Don't queue the same text twice (stops duplicate API calls and 429s)
    if (currentPlayingText === trimmed || ttsQueue.some((i) => i.text === trimmed)) {
      resolve();
      return;
    }

    ttsQueue.push({
      text: trimmed,
      signal,
      voiceId,
      resolve,
      reject,
    });
    processTtsQueue();
  });
}
