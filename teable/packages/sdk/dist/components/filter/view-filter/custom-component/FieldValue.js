import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useCrud } from '../../hooks';
import { useViewFilterContext } from '../hooks';
import { useFields } from '../hooks/useFields';
import { BaseFieldValue } from './BaseFieldValue';
export const FieldValue = (props) => {
    const { path, components, value, item, modal, referenceSource } = props;
    const fields = useFields();
    const { onChange } = useCrud();
    const linkContext = useViewFilterContext();
    const field = fields.find((f) => f.id === item.field);
    const defaultReferenceSource = useMemo(() => {
        if (!field) {
            return referenceSource;
        }
        if (referenceSource?.fields?.length) {
            return referenceSource;
        }
        const candidates = field.tableId
            ? fields.filter((candidate) => candidate.tableId === field.tableId)
            : fields;
        if (!candidates.length) {
            return referenceSource;
        }
        return {
            fields: candidates,
            tableId: field.tableId ?? candidates[0]?.tableId,
        };
    }, [field, fields, referenceSource]);
    return (_jsx(BaseFieldValue, { value: value, field: field, modal: modal, components: components, operator: item.operator, onSelect: (newValue) => {
            if (newValue === '' || (Array.isArray(newValue) && !newValue.length)) {
                onChange(path, null);
                return;
            }
            onChange(path, newValue);
        }, linkContext: linkContext, referenceSource: defaultReferenceSource }));
};
