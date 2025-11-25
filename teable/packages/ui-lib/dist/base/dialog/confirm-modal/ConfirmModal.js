import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '../../../shadcn';
import { Spin } from '../../spin/Spin';
import { confirmModalContext } from './context';
export const ConfirmModalProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const openModal = useCallback((options) => {
        setOptions(options);
        setOpen(true);
    }, []);
    const handleConfirm = async () => {
        if (options.onConfirm) {
            try {
                setLoading(true);
                await options.onConfirm();
            }
            catch (error) {
                console.error('Confirm modal error:', error);
            }
            finally {
                setLoading(false);
            }
        }
        setOpen(false);
        setOptions({});
    };
    const handleCancel = () => {
        if (options.onCancel) {
            options.onCancel();
        }
        setOpen(false);
        setOptions({});
    };
    const handleOpenChange = (open) => {
        if (!open) {
            handleCancel();
        }
    };
    return (_jsxs(confirmModalContext.Provider, { value: { openModal }, children: [children, _jsx(Dialog, { open: open, onOpenChange: handleOpenChange, children: _jsxs(DialogContent, { closeable: false, onPointerDownOutside: (e) => e.preventDefault(), onInteractOutside: (e) => e.preventDefault(), onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: [(options.title || options.description) && (_jsxs(DialogHeader, { children: [options.title && _jsx(DialogTitle, { children: options.title }), options.description && _jsx(DialogDescription, { children: options.description })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: handleCancel, disabled: loading, children: options.cancelText }), _jsxs(Button, { size: "sm", variant: options.confirmButtonVariant || 'default', onClick: handleConfirm, disabled: loading, children: [loading && _jsx(Spin, { className: "mr-2" }), options.confirmText] })] })] }) })] }));
};
