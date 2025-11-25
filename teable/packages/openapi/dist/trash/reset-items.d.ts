import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { z } from '../zod';
export declare const RESET_TRASH_ITEMS = "/trash/reset-items";
export declare const resetTrashItemsRoSchema: z.ZodObject<{
    resourceId: z.ZodString;
    resourceType: z.ZodEnum<[import("./get").ResourceType.Base, import("./get").ResourceType.Table]>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    resourceType: import("./get").ResourceType.Base | import("./get").ResourceType.Table;
    resourceId: string;
    cursor?: string | null | undefined;
}, {
    resourceType: import("./get").ResourceType.Base | import("./get").ResourceType.Table;
    resourceId: string;
    cursor?: string | null | undefined;
}>;
export type IResetTrashItemsRo = z.infer<typeof resetTrashItemsRoSchema>;
export declare const ResetTrashItemsRoute: RouteConfig;
export declare const resetTrashItems: (resetTrashItemsRo: IResetTrashItemsRo) => Promise<import("axios").AxiosResponse<null, any>>;
