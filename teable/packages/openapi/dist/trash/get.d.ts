import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { FieldType, ViewType } from '@teable/core';
import { z } from '../zod';
export declare const GET_TRASH = "/trash";
export declare enum ResourceType {
    Space = "space",
    Base = "base",
    Table = "table",
    View = "view",
    Field = "field",
    Record = "record"
}
export declare const userMapVoSchema: z.ZodRecord<z.ZodString, z.ZodObject<Pick<{
    userId: z.ZodString;
    userName: z.ZodString;
    email: z.ZodString;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
    avatar: z.ZodNullable<z.ZodString>;
    createdTime: z.ZodString;
    type: z.ZodLiteral<import("../space").PrincipalType.User>;
    resourceType: z.ZodNativeEnum<typeof import("../space").CollaboratorType>;
    isSystem: z.ZodOptional<z.ZodBoolean>;
    billable: z.ZodOptional<z.ZodBoolean>;
    base: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>>;
}, "email" | "avatar"> & {
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    email: string;
    avatar: string | null;
}, {
    name: string;
    id: string;
    email: string;
    avatar: string | null;
}>>;
export type IUserMapVo = z.infer<typeof userMapVoSchema>;
declare const fieldSnapshotItemVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodNativeEnum<typeof FieldType>;
    isLookup: z.ZodNullable<z.ZodBoolean>;
    isConditionalLookup: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    options: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: FieldType;
    id: string;
    isLookup: boolean | null;
    options?: string[] | null | undefined;
    isConditionalLookup?: boolean | null | undefined;
}, {
    name: string;
    type: FieldType;
    id: string;
    isLookup: boolean | null;
    options?: string[] | null | undefined;
    isConditionalLookup?: boolean | null | undefined;
}>;
declare const recordSnapshotItemVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
declare const viewSnapshotItemVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodNativeEnum<typeof ViewType>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: ViewType;
    id: string;
}, {
    name: string;
    type: ViewType;
    id: string;
}>;
export declare const resourceMapVoSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>, z.ZodObject<{
    id: z.ZodString;
    spaceId: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    spaceId: string;
}, {
    name: string;
    id: string;
    spaceId: string;
}>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodNativeEnum<typeof ViewType>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: ViewType;
    id: string;
}, {
    name: string;
    type: ViewType;
    id: string;
}>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodNativeEnum<typeof FieldType>;
    isLookup: z.ZodNullable<z.ZodBoolean>;
    isConditionalLookup: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    options: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: FieldType;
    id: string;
    isLookup: boolean | null;
    options?: string[] | null | undefined;
    isConditionalLookup?: boolean | null | undefined;
}, {
    name: string;
    type: FieldType;
    id: string;
    isLookup: boolean | null;
    options?: string[] | null | undefined;
    isConditionalLookup?: boolean | null | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>]>>;
export type IViewSnapshotItemVo = z.infer<typeof viewSnapshotItemVoSchema>;
export type IFieldSnapshotItemVo = z.infer<typeof fieldSnapshotItemVoSchema>;
export type IRecordSnapshotItemVo = z.infer<typeof recordSnapshotItemVoSchema>;
export type IResourceMapVo = z.infer<typeof resourceMapVoSchema>;
export declare const trashRoSchema: z.ZodObject<{
    resourceType: z.ZodEnum<[ResourceType.Space, ResourceType.Base]>;
}, "strip", z.ZodTypeAny, {
    resourceType: ResourceType.Space | ResourceType.Base;
}, {
    resourceType: ResourceType.Space | ResourceType.Base;
}>;
export type ITrashRo = z.infer<typeof trashRoSchema>;
export declare const trashItemVoSchema: z.ZodObject<{
    id: z.ZodString;
    resourceId: z.ZodString;
    resourceType: z.ZodEnum<[ResourceType.Space, ResourceType.Base, ResourceType.Table]>;
    deletedTime: z.ZodString;
    deletedBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    resourceType: ResourceType.Space | ResourceType.Base | ResourceType.Table;
    resourceId: string;
    deletedTime: string;
    deletedBy: string;
}, {
    id: string;
    resourceType: ResourceType.Space | ResourceType.Base | ResourceType.Table;
    resourceId: string;
    deletedTime: string;
    deletedBy: string;
}>;
export declare const tableTrashItemVoSchema: z.ZodObject<{
    id: z.ZodString;
    resourceIds: z.ZodArray<z.ZodString, "many">;
    resourceType: z.ZodEnum<[ResourceType.View, ResourceType.Field, ResourceType.Record]>;
    deletedTime: z.ZodString;
    deletedBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    resourceType: ResourceType.View | ResourceType.Field | ResourceType.Record;
    deletedTime: string;
    deletedBy: string;
    resourceIds: string[];
}, {
    id: string;
    resourceType: ResourceType.View | ResourceType.Field | ResourceType.Record;
    deletedTime: string;
    deletedBy: string;
    resourceIds: string[];
}>;
export type ITrashItemVo = z.infer<typeof trashItemVoSchema>;
export type ITableTrashItemVo = z.infer<typeof tableTrashItemVoSchema>;
export declare const trashVoSchema: z.ZodObject<{
    trashItems: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        id: z.ZodString;
        resourceId: z.ZodString;
        resourceType: z.ZodEnum<[ResourceType.Space, ResourceType.Base, ResourceType.Table]>;
        deletedTime: z.ZodString;
        deletedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        resourceType: ResourceType.Space | ResourceType.Base | ResourceType.Table;
        resourceId: string;
        deletedTime: string;
        deletedBy: string;
    }, {
        id: string;
        resourceType: ResourceType.Space | ResourceType.Base | ResourceType.Table;
        resourceId: string;
        deletedTime: string;
        deletedBy: string;
    }>, z.ZodObject<{
        id: z.ZodString;
        resourceIds: z.ZodArray<z.ZodString, "many">;
        resourceType: z.ZodEnum<[ResourceType.View, ResourceType.Field, ResourceType.Record]>;
        deletedTime: z.ZodString;
        deletedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        resourceType: ResourceType.View | ResourceType.Field | ResourceType.Record;
        deletedTime: string;
        deletedBy: string;
        resourceIds: string[];
    }, {
        id: string;
        resourceType: ResourceType.View | ResourceType.Field | ResourceType.Record;
        deletedTime: string;
        deletedBy: string;
        resourceIds: string[];
    }>]>, "many">;
    userMap: z.ZodRecord<z.ZodString, z.ZodObject<Pick<{
        userId: z.ZodString;
        userName: z.ZodString;
        email: z.ZodString;
        role: z.ZodNativeEnum<{
            readonly Owner: "owner";
            readonly Creator: "creator";
            readonly Editor: "editor";
            readonly Commenter: "commenter";
            readonly Viewer: "viewer";
        }>;
        avatar: z.ZodNullable<z.ZodString>;
        createdTime: z.ZodString;
        type: z.ZodLiteral<import("../space").PrincipalType.User>;
        resourceType: z.ZodNativeEnum<typeof import("../space").CollaboratorType>;
        isSystem: z.ZodOptional<z.ZodBoolean>;
        billable: z.ZodOptional<z.ZodBoolean>;
        base: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
        }, {
            name: string;
            id: string;
        }>>;
    }, "email" | "avatar"> & {
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    }, {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    }>>;
    resourceMap: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>, z.ZodObject<{
        id: z.ZodString;
        spaceId: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        spaceId: string;
    }, {
        name: string;
        id: string;
        spaceId: string;
    }>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodNativeEnum<typeof ViewType>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: ViewType;
        id: string;
    }, {
        name: string;
        type: ViewType;
        id: string;
    }>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodNativeEnum<typeof FieldType>;
        isLookup: z.ZodNullable<z.ZodBoolean>;
        isConditionalLookup: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        options: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: FieldType;
        id: string;
        isLookup: boolean | null;
        options?: string[] | null | undefined;
        isConditionalLookup?: boolean | null | undefined;
    }, {
        name: string;
        type: FieldType;
        id: string;
        isLookup: boolean | null;
        options?: string[] | null | undefined;
        isConditionalLookup?: boolean | null | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>]>>;
    nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
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
        type: FieldType;
        id: string;
        isLookup: boolean | null;
        options?: string[] | null | undefined;
        isConditionalLookup?: boolean | null | undefined;
    } | {
        name: string;
        id: string;
    } | {
        name: string;
        type: ViewType;
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
}, {
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
        type: FieldType;
        id: string;
        isLookup: boolean | null;
        options?: string[] | null | undefined;
        isConditionalLookup?: boolean | null | undefined;
    } | {
        name: string;
        id: string;
    } | {
        name: string;
        type: ViewType;
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
}>;
export type ITrashVo = z.infer<typeof trashVoSchema>;
export declare const GetTrashRoute: RouteConfig;
export declare const getTrash: (trashRo: ITrashRo) => Promise<import("axios").AxiosResponse<{
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
        type: FieldType;
        id: string;
        isLookup: boolean | null;
        options?: string[] | null | undefined;
        isConditionalLookup?: boolean | null | undefined;
    } | {
        name: string;
        id: string;
    } | {
        name: string;
        type: ViewType;
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
export {};
