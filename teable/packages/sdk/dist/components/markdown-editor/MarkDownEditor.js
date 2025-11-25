import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plate, usePlateEditor } from '@udecode/plate/react';
import { useEffect, useState } from 'react';
import { EditorContainer } from './EditorContainer';
import { MarkdownPreview } from './MarkDownPreview';
export const MarkDownEditor = (props) => {
    const { value, onChange, autoFocusLastNode } = props;
    const [markdownValue, setMarkdownValue] = useState(value || '');
    const markdownEditor = usePlateEditor({
        plugins: [],
        value: [{ children: [{ text: markdownValue }], type: 'p' }],
    });
    useEffect(() => {
        if (autoFocusLastNode) {
            markdownEditor.tf.focus();
            const lastNodeEntry = markdownEditor.api.last([]);
            if (lastNodeEntry) {
                const [, lastPath] = lastNodeEntry;
                const end = markdownEditor.api.end(lastPath);
                markdownEditor.tf.select(end);
            }
        }
    }, [autoFocusLastNode, markdownEditor]);
    return (_jsxs("div", { className: "flex flex-1 gap-0.5 overflow-hidden rounded-sm border", children: [_jsx(Plate, { onValueChange: () => {
                    const value = markdownEditor.children
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .map((node) => markdownEditor.api.string(node))
                        .join('\n');
                    setMarkdownValue(value);
                    onChange(value);
                }, editor: markdownEditor, children: _jsx(EditorContainer, { variant: 'ghost', className: "size-full rounded-none bg-secondary" }) }), _jsx(MarkdownPreview, { className: "w-1/2 overflow-auto", children: markdownValue })] }));
};
