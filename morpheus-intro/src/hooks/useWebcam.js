import { useState, useCallback, useRef } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { useGameStore } from '../stores/gameStore';

export function useWebcam() {
    const [isRequesting, setIsRequesting] = useState(false);
    const videoRef = useRef(null);

    const setWebcamStream = usePlayerStore((s) => s.setWebcamStream);
    const setWebcamError = usePlayerStore((s) => s.setWebcamError);
    const setWebcamPermission = useGameStore((s) => s.setWebcamPermission);

    const requestWebcam = useCallback(async () => {
        setIsRequesting(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 },
                audio: false,
            });

            setWebcamStream(stream);
            setWebcamPermission(true);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            return true;
        } catch (error) {
            setWebcamError(error.message);
            setWebcamPermission(false);
            return false;
        } finally {
            setIsRequesting(false);
        }
    }, [setWebcamStream, setWebcamError, setWebcamPermission]);

    const stopWebcam = useCallback(() => {
        const stream = usePlayerStore.getState().webcamStream;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setWebcamStream(null);
        }
    }, [setWebcamStream]);

    return {
        videoRef,
        isRequesting,
        requestWebcam,
        stopWebcam,
    };
}
