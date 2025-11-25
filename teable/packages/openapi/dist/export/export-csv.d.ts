import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const EXPORT_CSV_FROM_TABLE = "/export/{tableId}";
export declare const ExportCsvFromTableRoute: RouteConfig;
export declare const exportCsvFromTable: (tableId: string, viewId?: string) => Promise<import("axios").AxiosResponse<any, any>>;
