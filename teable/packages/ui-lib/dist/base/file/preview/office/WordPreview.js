import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '../../../../shadcn';
import { Spin } from '../../../spin/Spin';
import { getBlobFromUrl } from './utils';
export const WordPreview = ({ src }) => {
    const previewRef = useRef(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const renderDocx = async () => {
            const docxPromise = () => import('docx-preview');
            const docx = await docxPromise();
            if (previewRef.current && src) {
                const blob = await getBlobFromUrl(src);
                docx.renderAsync(blob, previewRef.current, undefined, {
                    useBase64URL: true,
                });
                setLoading(false);
            }
        };
        renderDocx();
    }, [src]);
    return (_jsx("div", { className: "size-full overflow-auto rounded-sm relative", ref: previewRef, children: loading && (_jsxs("div", { className: "size-full relative", children: [_jsx(Skeleton, { className: "size-full" }), _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", children: _jsx(Spin, {}) })] })) }));
};
