import { jsx as _jsx } from "react/jsx-runtime";
import { Sheet, SheetContent } from '@teable/ui-lib';
import { Modal } from './Modal';
import { ExpandRecordModel } from './type';
export const ExpandRecordWrap = (props) => {
    const { children, model, visible, onClose, modal, className } = props;
    if (model === ExpandRecordModel.Modal)
        return (_jsx(Modal, { visible: visible, onClose: onClose, modal: modal, className: className, children: children }));
    return (_jsx(Sheet, { modal: true, open: visible, onOpenChange: onClose, children: _jsx(SheetContent, { className: "h-5/6 overflow-hidden rounded-t-lg p-0", side: "bottom", closeable: false, children: children }) }));
};
