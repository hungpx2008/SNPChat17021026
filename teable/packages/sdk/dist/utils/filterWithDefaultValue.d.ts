import type { IFieldVo, IFilter, IFilterItem, ILinkCellValue, IUserCellValue } from '@teable/core';
export declare const validateFilterOperators: (filter: IFilter | IFilterItem | undefined) => boolean;
export declare const generateValueByFilteredField: ({ value, field, currentUserId, userMap, linkMap, }: {
    value: unknown;
    field: IFieldVo;
    currentUserId: string;
    userMap: Record<string, IUserCellValue>;
    linkMap: Record<string, ILinkCellValue>;
}) => unknown;
export declare const extractDefaultFieldsFromFilters: ({ filter, fieldMap, currentUserId, baseId, tableId, isAsync, }: {
    filter: IFilter | undefined;
    fieldMap: Record<string, IFieldVo>;
    currentUserId: string;
    baseId?: string | undefined;
    tableId?: string | undefined;
    isAsync?: boolean | undefined;
}) => Promise<Record<string, unknown>>;
