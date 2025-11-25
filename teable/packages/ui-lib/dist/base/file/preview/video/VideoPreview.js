import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
export const VideoPreview = (props) => {
    const { src, name, downloadUrl } = props;
    const videoRef = useRef(null);
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [src]);
    return (_jsxs("video", { ref: videoRef, className: "max-h-full max-w-full", controls: true, children: [_jsx("track", { kind: "captions", default: true }), _jsx("source", { src: src, type: "video/webm" }), _jsx("source", { src: src, type: "video/mp4" }), downloadUrl && (_jsx("a", { href: downloadUrl, download: name, children: "MP4" })), downloadUrl && (_jsx("a", { href: downloadUrl, download: name, children: "WEBM" }))] }));
};
