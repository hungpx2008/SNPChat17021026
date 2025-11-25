import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const FIX_BASE_INTEGRITY = "/integrity/base/{baseId}/link-fix?tableId={tableId}";
export declare const IntegrityFixRoute: RouteConfig;
export declare const fixBaseIntegrity: (baseId: string, tableId: string) => Promise<import("axios").AxiosResponse<any, any>>;
