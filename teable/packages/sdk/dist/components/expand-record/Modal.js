import { jsx as _jsx } from "react/jsx-runtime";
import { Dialog, DialogContent, cn } from '@teable/ui-lib';
import { useRef } from 'react';
import { ModalContext } from './ModalContext';
export const Modal = (props) => {
    const { modal, className, children, container, visible, onClose } = props;
    const ref = useRef(null);
    return (_jsx(Dialog, { open: visible, modal: modal, children: _jsx(DialogContent, { closeable: false, container: container, className: cn('h-full block p-0 max-w-4xl', className), style: { width: 'calc(100% - 40px)', height: 'calc(100% - 100px)' }, onKeyDown: (e) => {
                if (e.key === 'Escape') {
                    onClose?.();
                }
                if (e.key === 'Enter') {
                    return;
                }
                e.stopPropagation();
            }, onMouseDown: (e) => e.stopPropagation(), onPointerDown: (e) => e.stopPropagation(), onPointerDownOutside: (e) => e.preventDefault(), onInteractOutside: (e) => {
                e.stopPropagation();
                e.preventDefault();
            }, ref: ref, children: _jsx(ModalContext.Provider, { value: { ref }, children: children }) }) }));
};
