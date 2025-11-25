import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IInplaceImportOptionRo } from './types';
export declare const INPLACE_IMPORT_TABLE = "/import/{baseId}/{tableId}";
export declare const inplaceImportTableFromFileRoute: RouteConfig;
export declare const inplaceImportTableFromFile: (baseId: string, tableId: string, inplaceImportRo: IInplaceImportOptionRo) => Promise<import("axios").AxiosResponse<void, any>>;
