import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogTrigger } from '@teable/ui-lib';
import * as React from 'react';
import { MemberContent } from './MemberContent';
export const MemberSelectorDialog = React.forwardRef(({ header, children, departmentId, disabledDepartment, defaultSelectedMembers, onConfirm, onCancel, onLoadData, }, ref) => {
    const [open, setOpen] = React.useState(false);
    const contentRef = React.useRef(null);
    React.useImperativeHandle(ref, () => ({
        open: (selectedMembers) => {
            contentRef.current?.open(selectedMembers);
            setOpen(true);
        },
        close: () => {
            setOpen(false);
        },
    }));
    const handleConfirm = (members) => {
        onConfirm?.(members);
        setOpen(false);
    };
    const handleChange = (open) => {
        setOpen(open);
        if (!open) {
            onCancel?.();
        }
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: handleChange, children: [_jsx(DialogTrigger, { asChild: true, children: children }), _jsx(DialogContent, { className: "w-[80vw] min-w-[600px]  max-w-6xl", children: _jsx(MemberContent, { ref: contentRef, header: header, className: "h-[80vh]", departmentId: departmentId, disabledDepartment: disabledDepartment, defaultSelectedMembers: defaultSelectedMembers, onCancel: () => {
                        handleChange(false);
                    }, onLoadData: onLoadData, onConfirm: handleConfirm }) })] }));
});
MemberSelectorDialog.displayName = 'MemberSelectorDialog';
export default MemberSelectorDialog;
