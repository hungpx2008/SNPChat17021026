import { jsx as _jsx } from "react/jsx-runtime";
import { BaseQueryColumnType } from '@teable/openapi';
import { useTranslation } from '../../../../context/app/i18n';
import { createFieldInstance } from '../../../../model';
import { NumberEditor } from '../../../editor';
import { BaseFieldValue } from '../../../filter';
import { useCrud } from '../../../filter/hooks';
import { useAllColumns } from '../../common/useAllColumns';
export const ValueComponent = (props) => {
    const { path, value, item } = props;
    const { onChange } = useCrud();
    const columns = useAllColumns();
    const { t } = useTranslation();
    const field = columns.find((column) => column.column === item.field)?.fieldSource;
    if (field && item.type === BaseQueryColumnType.Field && item.field) {
        return (_jsx(BaseFieldValue, { value: value, onSelect: (value) => {
                onChange(path, value);
            }, operator: item.operator, field: createFieldInstance(field) }));
    }
    if (item.type === BaseQueryColumnType.Aggregation) {
        return (_jsx(NumberEditor, { value: value, onChange: (value) => onChange(path, value), className: "w-40 placeholder:text-xs", placeholder: t('filter.default.placeholder') }));
    }
};
