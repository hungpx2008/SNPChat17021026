import { jsx as _jsx } from "react/jsx-runtime";
import { LinkViewProvider, RowCountProvider } from '../../../../../context';
import { useTranslation } from '../../../../../context/app/i18n';
import { LinkFilterProvider } from '../../../../../context/query/LinkFilterProvider';
import { SocketRecordList } from '../../../../record-list';
import { StorageLinkSelected } from './storage';
export const DefaultList = (props) => {
    const { field, value, onClick } = props;
    const { t } = useTranslation();
    const isSingle = typeof value === 'string';
    const values = isSingle ? [value] : value;
    return (_jsx(LinkViewProvider, { linkFieldId: field.id, fallback: _jsx("h1", { children: t('common.empty') }), children: _jsx(LinkFilterProvider, { filterLinkCellSelected: field.id, children: _jsx(RowCountProvider, { children: _jsx(SocketRecordList, { selectedRecordIds: values || undefined, onClick: (value) => {
                        onClick(value.id);
                        StorageLinkSelected.set(`${field.options.foreignTableId}-${value.id}`, value.title);
                    }, lookupFieldId: field.options.lookupFieldId }) }) }) }));
};
