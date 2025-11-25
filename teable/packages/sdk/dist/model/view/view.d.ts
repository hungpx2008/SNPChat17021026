import type { IFilter, ISort, IShareViewMeta, IViewVo, IColumnMetaRo, IManualSortRo, IGroup } from '@teable/core';
import { ViewCore } from '@teable/core';
import type { IUpdateOrderRo } from '@teable/openapi';
import type { AxiosResponse } from 'axios';
import type { Doc } from 'sharedb/lib/client';
export declare abstract class View extends ViewCore {
    protected doc: Doc<IViewVo>;
    tableId: string;
    abstract updateOption(option: object): Promise<AxiosResponse<void, any>> | void;
    apiEnableShare(): Promise<AxiosResponse<{
        shareId: string;
    }, any>>;
    disableShare(): Promise<AxiosResponse<void, any>>;
    manualSort(sortRo: IManualSortRo): Promise<AxiosResponse<{
        createdTime: string;
        createdBy: string;
        id: string;
        name: string;
        type: import("@teable/core").ViewType;
        columnMeta: Record<string, {
            order: number;
            width?: number | undefined;
            hidden?: boolean | undefined;
            statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            visible?: boolean | undefined;
        } | {
            order: number;
            required?: boolean | undefined;
            visible?: boolean | undefined;
        } | {
            order: number;
            hidden?: boolean | undefined;
        }>;
        description?: string | undefined;
        filter?: import("@teable/core").IFilterSet | null | undefined;
        sort?: {
            sortObjs: {
                fieldId: string;
                order: import("@teable/core").SortFunc;
            }[];
            manualSort?: boolean | undefined;
        } | null | undefined;
        lastModifiedTime?: string | undefined;
        lastModifiedBy?: string | undefined;
        options?: {
            startDateFieldId?: string | null | undefined;
            endDateFieldId?: string | null | undefined;
            titleFieldId?: string | null | undefined;
            colorConfig?: {
                type: import("@teable/core").ColorConfigType;
                color?: import("@teable/core").Colors | null | undefined;
                fieldId?: string | null | undefined;
            } | null | undefined;
        } | {
            coverUrl?: string | undefined;
            logoUrl?: string | undefined;
            submitLabel?: string | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
        } | {
            rowHeight?: import("@teable/core").RowHeightLevel | undefined;
            fieldNameDisplayLines?: number | undefined;
            frozenColumnCount?: number | undefined;
        } | {
            coverFieldId?: string | null | undefined;
            isCoverFit?: boolean | undefined;
            isFieldNameHidden?: boolean | undefined;
            stackFieldId?: string | undefined;
            isEmptyStackHidden?: boolean | undefined;
        } | {
            pluginId: string;
            pluginInstallId: string;
            pluginLogo: string;
        } | undefined;
        order?: number | undefined;
        pluginId?: string | undefined;
        group?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        isLocked?: boolean | undefined;
        shareId?: string | undefined;
        enableShare?: boolean | undefined;
        shareMeta?: {
            password?: string | undefined;
            allowCopy?: boolean | undefined;
            includeHiddenField?: boolean | undefined;
            includeRecords?: boolean | undefined;
            submit?: {
                allow?: boolean | undefined;
                requireLogin?: boolean | undefined;
            } | undefined;
        } | undefined;
    }, any>>;
    updateColumnMeta(columnMetaRo: IColumnMetaRo): Promise<AxiosResponse<void, any>>;
    updateFilter(filter: IFilter): Promise<AxiosResponse<void, any>>;
    updateSort(sort: ISort): Promise<AxiosResponse<void, any>>;
    updateGroup(group: IGroup): Promise<AxiosResponse<void, any>>;
    updateOrder(orderRo: IUpdateOrderRo): Promise<AxiosResponse<void, any>>;
    updateName(name: string): Promise<AxiosResponse<void, any>>;
    updateDescription(description: string): Promise<AxiosResponse<void, any>>;
    setRefreshLink(): Promise<AxiosResponse<void, any>>;
    setShareMeta(shareMeta: IShareViewMeta): Promise<AxiosResponse<void, any>>;
    updateLocked(isLocked: boolean): Promise<AxiosResponse<void, any>>;
}
