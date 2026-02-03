import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebcam } from '../../../hooks/useWebcam';
import { usePlayerStore } from '../../../stores/playerStore';

export function BrowserApp({ onDownload }) {
    const [url, setUrl] = useState('https://portal.save-corp.com/login');
    const [step, setStep] = useState(0); // 0: Login, 1: Permission, 2: Photo, 3: Profile, 4: Download
    const { requestWebcam } = useWebcam();
    const [name, setName] = useState('');
    const setPlayerName = usePlayerStore(state => state.setPlayerName);
    const setCapturedPhoto = usePlayerStore(state => state.setCapturedPhoto);
    const capturedPhoto = usePlayerStore(state => state.capturedPhoto);
    const webcamStream = usePlayerStore(state => state.webcamStream); // Step 1 Allow 시 이미 얻은 스트림
    const setWebcamStream = usePlayerStore(state => state.setWebcamStream);
    const [isLoading, setIsLoading] = useState(false);

    // Photo step: stream and refs — Step 1에서 얻은 스트림을 재사용 (이중 getUserMedia 방지)
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [photoStatus, setPhotoStatus] = useState('idle'); // idle | ready | capturing | done
    const [cameraError, setCameraError] = useState(null);
    const [videoPlaying, setVideoPlaying] = useState(false); // iframe에서 자동재생 막힐 때 클릭으로 재생

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setUrl('https://portal.save-corp.com/verification');
            setStep(1);
        }, 1500);
    };

    const handlePermission = async (allow) => {
        if (allow) {
            await requestWebcam();
            setStep(2);
            setUrl('https://portal.save-corp.com/verify-identity');
            setCameraError(null);
        } else {
            alert("Camera access is mandatory for S.A.V.E. employment.");
        }
    };

    // Step 2 Photo: Step 1에서 이미 얻은 스트림(webcamStream)을 video에 붙임. 이중 getUserMedia 시 검은 화면 방지.
    // Video ref can be null on first run due to AnimatePresence/motion; defer attachment and retry.
    useEffect(() => {
        if (step !== 2) return;
        setPhotoStatus('idle');
        setVideoPlaying(false);
        let fallbackReady = null;
        let ownedStream = null;
        let cancelled = false;

        const attachStreamToVideo = (stream, video) => {
            if (!video || !stream || cancelled) return;
            streamRef.current = stream;
            video.srcObject = stream;
            video.muted = true;
            video.playsInline = true;
            video.load?.();
            video.play().then(() => setVideoPlaying(true)).catch(() => {});
            const setReady = () => {
                if (cancelled) return;
                setPhotoStatus('ready');
                if (fallbackReady) clearTimeout(fallbackReady);
            };
            video.addEventListener('playing', () => {
                setVideoPlaying(true);
                setReady();
            }, { once: true });
            fallbackReady = setTimeout(setReady, 1200);
        };

        const tryAttach = (attempt = 0) => {
            if (cancelled) return;
            // Prefer latest stream from store (avoids stale closure)
            const stream = usePlayerStore.getState().webcamStream || null;
            const video = videoRef.current;

            if (stream && stream.active && video) {
                attachStreamToVideo(stream, video);
                setCameraError(null);
                return;
            }
            if (!stream || !stream.active) {
                // Step 1에서 스트림이 없으면 여기서 한 번만 열기
                if (!navigator.mediaDevices?.getUserMedia) {
                    setCameraError('Camera not supported');
                    return;
                }
                navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
                    .then((s) => {
                        if (cancelled) {
                            s.getTracks().forEach(t => t.stop());
                            return;
                        }
                        ownedStream = s;
                        usePlayerStore.getState().setWebcamStream(s);
                        const v = videoRef.current;
                        if (v) {
                            attachStreamToVideo(s, v);
                        } else {
                            streamRef.current = s;
                            setTimeout(() => tryAttach(0), 50);
                        }
                        setCameraError(null);
                    })
                    .catch((err) => {
                        if (!cancelled) {
                            setCameraError(err.message || 'Camera access denied');
                            setPhotoStatus('idle');
                        }
                    });
                return;
            }
            // Stream exists but video ref not ready (AnimatePresence delay): retry
            if (attempt < 8) {
                setTimeout(() => tryAttach(attempt + 1), 50 + attempt * 25);
            } else {
                setPhotoStatus('ready');
            }
        };

        const t = setTimeout(() => tryAttach(0), 0);

        return () => {
            cancelled = true;
            if (fallbackReady) clearTimeout(fallbackReady);
            clearTimeout(t);
            if (ownedStream) ownedStream.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setVideoPlaying(false);
        };
    }, [step, webcamStream]);

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const stream = streamRef.current;
        if (!video || !canvas || !stream || photoStatus === 'capturing' || photoStatus === 'done') return;
        setPhotoStatus('capturing');

        const doCapture = () => {
            try {
                canvas.width = 300;
                canvas.height = 300;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const d = imgData.data;
                for (let i = 0; i < d.length; i += 4) {
                    const g = (d[i] + d[i + 1] + d[i + 2]) / 3;
                    d[i] = d[i + 1] = d[i + 2] = g;
                }
                ctx.putImageData(imgData, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                setCapturedPhoto(dataUrl);
                stream.getTracks().forEach(t => t.stop());
                setWebcamStream(null);
                streamRef.current = null;
                setPhotoStatus('done');
                setTimeout(() => {
                    setStep(3);
                    setUrl('https://portal.save-corp.com/profile');
                    setPhotoStatus('idle');
                }, 800);
            } catch (e) {
                setPhotoStatus('ready');
            }
        };

        // Only capture when video has current frame data (readyState >= 2), else wait one frame
        if (video.readyState >= 2) {
            doCapture();
        } else {
            const onReady = () => {
                video.removeEventListener('loadeddata', onReady);
                requestAnimationFrame(() => requestAnimationFrame(doCapture));
            };
            video.addEventListener('loadeddata', onReady);
            // Fallback: if no event within 1s, capture anyway
            setTimeout(() => {
                video.removeEventListener('loadeddata', onReady);
                if (streamRef.current === stream) doCapture();
            }, 1000);
        }
    };

    const skipPhoto = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            setWebcamStream(null);
            streamRef.current = null;
        }
        setStep(3);
        setUrl('https://portal.save-corp.com/profile');
        setPhotoStatus('idle');
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        setTimeout(() => {
            setPlayerName(name);
            setIsLoading(false);
            setStep(4);
            setUrl('https://portal.save-corp.com/download');
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans text-black">
            {/* Browser Chrome */}
            <div className="bg-gray-100 border-b p-2 flex items-center gap-2">
                <div className="flex gap-1 mr-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <button className="text-gray-400 hover:text-black font-bold px-2">&larr;</button>
                <button className="text-gray-400 hover:text-black font-bold px-2">&rarr;</button>
                <button className="text-gray-400 hover:text-black font-bold px-2">↻</button>
                <div className="flex-1 bg-white border rounded px-3 py-1 text-sm text-gray-700 flex items-center shadow-inner">
                    <span className="text-green-600 mr-2">🔒</span>
                    {url}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-gray-50 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                )}

                <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow-md border">
                    <div className="flex justify-center mb-8">
                        <div className="text-2xl font-black text-gray-800 tracking-tighter">S.A.V.E. Portal</div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center"
                            >
                                <h2 className="text-xl mb-6 font-bold">Employee Login</h2>
                                <button
                                    onClick={handleLogin}
                                    className="w-full flex items-center justify-center gap-3 border shadow-sm py-3 px-4 rounded hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span>Sign in with Google</span>
                                </button>
                                <p className="mt-4 text-xs text-gray-400">Secure 256-bit Encryption</p>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="permission"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl mb-4 font-bold text-center">Security Verification</h2>
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6 text-sm text-yellow-800">
                                    S.A.V.E. requires camera access to verify your identity during work sessions.
                                </div>

                                {/* Fake Permission Popup Simulation */}
                                <div className="absolute inset-0 bg-black/20 flex items-start pt-20 justify-center z-50 rounded">
                                    <motion.div
                                        className="bg-white rounded-lg shadow-xl p-4 w-72 text-left"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                    >
                                        <p className="mb-4 text-sm font-medium text-gray-700">
                                            portal.save-corp.com wants to use your camera
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handlePermission(false)}
                                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                            >
                                                Block
                                            </button>
                                            <button
                                                onClick={() => handlePermission(true)}
                                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                                            >
                                                Allow
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="photo"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center"
                            >
                                <h2 className="text-xl mb-2 font-bold">Identity Verification</h2>
                                <p className="text-sm text-gray-600 mb-4">Position your face in the frame and take your profile photo.</p>
                                {cameraError && (
                                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                                        {cameraError}
                                        <button type="button" onClick={skipPhoto} className="ml-2 text-blue-600 underline">Skip</button>
                                    </div>
                                )}
                                <div className="relative mx-auto w-full max-w-xs aspect-video rounded-lg border-2 border-gray-300 bg-black overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                </div>
                                <canvas ref={canvasRef} className="hidden" />
                                {photoStatus === 'capturing' && (
                                    <p className="mt-2 text-sm text-green-600 font-medium">Capturing...</p>
                                )}
                                {photoStatus === 'done' && (
                                    <p className="mt-2 text-sm text-green-600 font-medium">Photo saved. Proceeding...</p>
                                )}
                                <div className="mt-4 flex gap-2 justify-center flex-wrap">
                                    {photoStatus === 'ready' && (
                                        <button
                                            type="button"
                                            onClick={capturePhoto}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                                        >
                                            Take Photo
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl mb-6 font-bold text-center">Complete Profile</h2>
                                {capturedPhoto && (
                                    <div className="flex justify-center mb-4">
                                        <div className="text-xs font-medium text-gray-500 mb-1 block">Profile Photo</div>
                                        <img
                                            src={capturedPhoto}
                                            alt="Profile"
                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                                        />
                                    </div>
                                )}
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder=""
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded bg-gray-100 text-gray-500"
                                            value="Data Processing Unit"
                                            disabled
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 mt-4"
                                    >
                                        Save & Continue
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="download"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="text-6xl mb-4">⬇️</div>
                                <h2 className="text-xl font-bold mb-2">Setup Required</h2>
                                <p className="text-gray-600 mb-6">
                                    Please download and install the secure workspace software to begin.
                                </p>
                                <button
                                    onClick={onDownload}
                                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg animate-bounce"
                                >
                                    Download Workspace.exe (45MB)
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
