import { jsx as _jsx } from "react/jsx-runtime";
import { Spin } from '@teable/ui-lib';
import { useContext } from 'react';
import { useTranslation } from '../../../../../context/app/i18n';
import { SelectTag } from '../../../../cell-value';
import { FilterLinkContext } from './context';
import { StorageLinkSelected } from './storage';
export const DefaultTrigger = (props) => {
    const { value, field } = props;
    const { t } = useTranslation();
    const foreignTableId = field.options.foreignTableId;
    const { context } = useContext(FilterLinkContext);
    const values = typeof value === 'string' ? [value] : value;
    const recordMap = context?.data?.find((item) => item.tableId === foreignTableId)?.data;
    return context?.isLoading ? (_jsx(Spin, { className: "size-4" })) : value ? (values?.map((id) => (_jsx(SelectTag, { className: "flex items-center", label: recordMap?.[id] ||
            StorageLinkSelected.get(`${field.options.foreignTableId}-${id}`) ||
            t('common.unnamedRecord') }, id)))) : (t('common.selectPlaceHolder'));
};
