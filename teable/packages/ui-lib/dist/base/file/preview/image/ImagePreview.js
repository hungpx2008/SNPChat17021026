import { jsx as _jsx } from "react/jsx-runtime";
export const ImagePreview = (props) => {
    const { src, name } = props;
    return _jsx("img", { className: "max-h-full max-w-full", src: src, alt: name });
};
