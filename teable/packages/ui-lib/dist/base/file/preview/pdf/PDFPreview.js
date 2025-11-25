import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Skeleton } from '../../../../shadcn';
import { Spin } from '../../../spin/Spin';
import { getBlobUrlFromUrl } from './utils';
export const PDFPreview = (props) => {
    const [blobUrl, setBlobUrl] = useState('');
    useEffect(() => {
        getBlobUrlFromUrl(props.src).then((res) => {
            setBlobUrl(res);
        });
    }, [props.src]);
    return blobUrl ? (_jsx("iframe", { src: blobUrl, width: "100%", height: "100%", title: "PDF Viewer", loading: "lazy", className: "border-none rounded-sm" })) : (_jsxs("div", { className: "size-full relative", children: [_jsx(Skeleton, { className: "size-full" }), _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", children: _jsx(Spin, {}) })] }));
};
