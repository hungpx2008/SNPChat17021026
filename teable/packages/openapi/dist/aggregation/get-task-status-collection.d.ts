import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const taskStatusCollectionVoSchema: z.ZodObject<{
    cells: z.ZodArray<z.ZodObject<{
        recordId: z.ZodString;
        fieldId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        recordId: string;
        fieldId: string;
    }, {
        recordId: string;
        fieldId: string;
    }>, "many">;
    fieldMap: z.ZodRecord<z.ZodString, z.ZodObject<{
        taskId: z.ZodString;
        completedCount: z.ZodNumber;
        totalCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        taskId: string;
        completedCount: number;
        totalCount: number;
    }, {
        taskId: string;
        completedCount: number;
        totalCount: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    cells: {
        recordId: string;
        fieldId: string;
    }[];
    fieldMap: Record<string, {
        taskId: string;
        completedCount: number;
        totalCount: number;
    }>;
}, {
    cells: {
        recordId: string;
        fieldId: string;
    }[];
    fieldMap: Record<string, {
        taskId: string;
        completedCount: number;
        totalCount: number;
    }>;
}>;
export type ITaskStatusCollectionVo = z.infer<typeof taskStatusCollectionVoSchema>;
export declare const GET_TASK_STATUS_COLLECTION = "/table/{tableId}/aggregation/task-status-collection";
export declare const GetTaskStatusCollectionRoute: RouteConfig;
export declare const getTaskStatusCollection: (tableId: string) => Promise<import("axios").AxiosResponse<{
    cells: {
        recordId: string;
        fieldId: string;
    }[];
    fieldMap: Record<string, {
        taskId: string;
        completedCount: number;
        totalCount: number;
    }>;
}, any>>;
