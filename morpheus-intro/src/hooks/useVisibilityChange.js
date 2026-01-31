import { useEffect } from 'react';

export function useVisibilityChange(onHidden, onVisible) {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                onHidden?.();
            } else {
                onVisible?.();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [onHidden, onVisible]);
}
