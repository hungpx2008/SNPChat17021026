import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@teable/ui-lib';
import { useRef } from 'react';
import { useLocalStorage, useMeasure } from 'react-use';
import { LocalStorageKeys } from '../../config';
import { useTranslation } from '../../context/app/i18n';
import { RecordEditorItem } from './RecordEditorItem';
// eslint-disable-next-line @typescript-eslint/naming-convention
const EDITOR_VERTICAL_MIN = 570;
export const RecordEditor = (props) => {
    const { t } = useTranslation();
    const [ref, { width }] = useMeasure();
    const wrapRef = useRef(null);
    const { fields, hiddenFields = [], record, onChange, readonly, buttonClickStatusHook } = props;
    const vertical = width > EDITOR_VERTICAL_MIN;
    const [hiddenFieldsVisible, setHiddenFieldsVisible] = useLocalStorage(LocalStorageKeys.ExpandRecordHiddenFieldsVisible, false);
    return (_jsx("div", { ref: ref, className: "max-w-3xl", children: _jsxs("div", { ref: wrapRef, className: "mx-auto space-y-6", children: [fields.map((field) => (_jsx(RecordEditorItem, { vertical: vertical, field: field, record: record, onChange: onChange, readonly: typeof readonly === 'function' ? readonly(field) : readonly, buttonClickStatusHook: buttonClickStatusHook }, field.id))), hiddenFields.length !== 0 && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "border-top-width h-px flex-1 bg-border" }), _jsx(Button, { size: 'xs', variant: 'outline', onClick: () => setHiddenFieldsVisible(!hiddenFieldsVisible), children: hiddenFieldsVisible
                                ? t('expandRecord.hideHiddenFields', { count: hiddenFields.length })
                                : t('expandRecord.showHiddenFields', { count: hiddenFields.length }) }), _jsx("div", { className: "border-top-width h-px flex-1 bg-border" })] })), hiddenFieldsVisible &&
                    hiddenFields?.map((field) => (_jsx(RecordEditorItem, { vertical: vertical, field: field, record: record, onChange: onChange, readonly: typeof readonly === 'function' ? readonly(field) : readonly, buttonClickStatusHook: buttonClickStatusHook }, field.id)))] }) }));
};
