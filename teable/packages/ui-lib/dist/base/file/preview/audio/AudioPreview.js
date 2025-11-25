import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AudioPreview = (props) => {
    const { src, name, downloadUrl } = props;
    return (_jsxs("audio", { className: "max-h-full max-w-full", controls: true, src: src, children: [_jsx("track", { kind: "captions", default: true }), downloadUrl && (_jsx("a", { href: downloadUrl, download: name, children: "Download audio" }))] }));
};
