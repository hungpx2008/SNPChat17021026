import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const RESTORE_TRASH = "/trash/restore/{trashId}";
export declare const RestoreTrashRoute: RouteConfig;
export declare const restoreTrash: (trashId: string) => Promise<import("axios").AxiosResponse<any, any>>;
