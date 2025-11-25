import { useRef, useState, useLayoutEffect } from 'react';
export function useResizeObserver(initialSize) {
    const ref = useRef(null);
    const [size, setSize] = useState({
        width: initialSize?.[0] || 0,
        height: initialSize?.[1] || 0,
    });
    useLayoutEffect(() => {
        const resizeCallback = (entries) => {
            let diffHeight = document.body.clientHeight - window.innerHeight;
            diffHeight = isNaN(diffHeight) ? 0 : diffHeight;
            for (const entry of entries) {
                const { width, height } = (entry && entry.contentRect) || {};
                setSize((cv) => cv.width === width && cv.height === height
                    ? cv
                    : { width: Math.floor(width), height: height - diffHeight });
            }
        };
        const resizeObserver = new window.ResizeObserver(resizeCallback);
        if (ref.current) {
            resizeObserver.observe(ref.current, undefined);
        }
        return () => {
            resizeObserver.disconnect();
        };
    }, []);
    return { ref, ...size };
}
