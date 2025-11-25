import { jsx as _jsx } from "react/jsx-runtime";
import { StandaloneViewProvider } from '../../../../../context';
import { useTranslation } from '../../../../../context/app/i18n';
import { useBaseId } from '../../../../../hooks/use-base-id';
import { SocketRecordList } from '../../../../record-list';
import { StorageLinkSelected } from './storage';
export const StandDefaultList = (props) => {
    const { field, value, onClick } = props;
    const { t } = useTranslation();
    const baseId = useBaseId();
    const isSingle = typeof value === 'string';
    const values = isSingle ? [value] : value;
    return (_jsx(StandaloneViewProvider, { baseId: baseId, tableId: field.options.foreignTableId, fallback: _jsx("h1", { children: t('common.empty') }), children: _jsx(SocketRecordList, { selectedRecordIds: values || undefined, onClick: (value) => {
                onClick(value.id);
                StorageLinkSelected.set(`${field.options.foreignTableId}-${value.id}`, value.title);
            }, lookupFieldId: field.options.lookupFieldId }) }));
};
