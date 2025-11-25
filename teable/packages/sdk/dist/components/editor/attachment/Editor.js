import { jsx as _jsx } from "react/jsx-runtime";
import { noop } from 'lodash';
import { UploadAttachment } from './upload-attachment/UploadAttachment';
export const AttachmentEditor = (props) => {
    const { className, value, onChange = noop, readonly } = props;
    return (_jsx(UploadAttachment, { className: className, attachments: value || [], onChange: onChange, readonly: readonly }));
};
