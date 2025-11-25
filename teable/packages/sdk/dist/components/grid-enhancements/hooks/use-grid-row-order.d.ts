/// <reference types="react" />
import type { IRecordIndexMap } from './use-grid-async-records';
export declare const useGridRowOrder: (recordMap: IRecordIndexMap) => {
    onRowOrdered: (rowIndexCollection: number[], newRowIndex: number) => Promise<import("axios").AxiosResponse<{
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }[], any>> | undefined;
    setDraggingRecordIds: import("react").Dispatch<import("react").SetStateAction<string[] | undefined>>;
};
