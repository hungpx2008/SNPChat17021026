import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { ResourceType } from './get';
export declare const GET_TRASH_ITEMS = "/trash/items";
export declare const trashItemsRoSchema: z.ZodObject<{
    resourceId: z.ZodString;
    resourceType: z.ZodEnum<[ResourceType.Base, ResourceType.Table]>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    resourceType: ResourceType.Base | ResourceType.Table;
    resourceId: string;
    cursor?: string | null | undefined;
}, {
    resourceType: ResourceType.Base | ResourceType.Table;
    resourceId: string;
    cursor?: string | null | undefined;
}>;
export type ITrashItemsRo = z.infer<typeof trashItemsRoSchema>;
export declare const GetTrashItemsRoute: RouteConfig;
export declare const getTrashItems: (trashItemsRo: ITrashItemsRo) => Promise<import("axios").AxiosResponse<{
    trashItems: ({
        id: string;
        resourceType: ResourceType.Space | ResourceType.Base | ResourceType.Table;
        resourceId: string;
        deletedTime: string;
        deletedBy: string;
    } | {
        id: string;
        resourceType: ResourceType.View | ResourceType.Field | ResourceType.Record;
        deletedTime: string;
        deletedBy: string;
        resourceIds: string[];
    })[];
    userMap: Record<string, {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    }>;
    resourceMap: Record<string, {
        name: string;
        type: import("@teable/core").FieldType;
        id: string;
        isLookup: boolean | null;
        options?: string[] | null | undefined;
        isConditionalLookup?: boolean | null | undefined;
    } | {
        name: string;
        id: string;
    } | {
        name: string;
        type: import("@teable/core").ViewType;
        id: string;
    } | {
        name: string;
        id: string;
    } | {
        name: string;
        id: string;
        spaceId: string;
    } | {
        name: string;
        id: string;
    }>;
    nextCursor?: string | null | undefined;
}, any>>;
