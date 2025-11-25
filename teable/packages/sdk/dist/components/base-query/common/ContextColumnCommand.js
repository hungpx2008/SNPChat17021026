import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from '@teable/icons';
import { cn, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from '@teable/ui-lib';
import { groupBy } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { useTables } from '../../../hooks';
import { useAllColumns } from './useAllColumns';
export const ContextColumnsCommand = (props) => {
    const { checked, onClick, isFilter } = props;
    const { t } = useTranslation();
    const columns = useAllColumns(isFilter);
    const tables = useTables();
    const checkedArray = useMemo(() => (typeof checked === 'string' && checked ? [checked] : checked), [checked]);
    const { noGroupedColumns, groupedColumns, columnMap } = useMemo(() => {
        const noGroupedColumns = columns.filter((column) => !column.groupTableId);
        const groupedColumns = groupBy(columns.filter((column) => column.groupTableId), 'groupTableId');
        const columnMap = columns.reduce((pre, cur) => {
            pre[cur.column] = cur;
            return pre;
        }, {});
        return { noGroupedColumns, groupedColumns, columnMap };
    }, [columns]);
    const groupMap = useMemo(() => {
        return tables.reduce((pre, cur) => {
            pre[cur.id] = cur;
            return pre;
        }, {});
    }, [tables]);
    return (_jsxs(Command, { filter: (value, search) => {
            if (!search)
                return 1;
            const item = columnMap[value];
            const text = item.name;
            if (text?.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                return 1;
            return 0;
        }, children: [_jsx(CommandInput, { placeholder: t('common.search.placeholder') }), _jsx(CommandEmpty, { children: t('common.empty') }), _jsxs(CommandList, { children: [_jsx(CommandGroup, { children: noGroupedColumns.map((column) => {
                            const isSelected = checkedArray?.some((item) => item === column.column);
                            return (_jsxs(CommandItem, { value: column.column, onSelect: () => {
                                    onClick?.(column, {
                                        preSelected: isSelected,
                                    });
                                }, children: [_jsx(Check, { className: cn('mr-2 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0') }), _jsx("span", { className: "ml-2 truncate", children: column.name })] }, column.column));
                        }) }), Object.keys(groupedColumns).map((group) => (_jsx(CommandGroup, { heading: groupMap[group].name, children: groupedColumns[group].map((column) => {
                            const isSelected = checkedArray?.some((item) => item === column.column);
                            return (_jsxs(CommandItem, { value: column.column, onSelect: () => {
                                    onClick?.(column, {
                                        preSelected: isSelected,
                                        group: {
                                            id: group,
                                            name: groupMap[group].name,
                                        },
                                    });
                                }, children: [_jsx(Check, { className: cn('mr-2 h-4 w-4 flex-shrink-0', isSelected ? 'opacity-100' : 'opacity-0') }), _jsx("span", { className: "ml-2 truncate", children: column.name })] }, column.column));
                        }) }, group)))] })] }));
};
