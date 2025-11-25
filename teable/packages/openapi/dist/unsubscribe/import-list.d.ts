import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const IMPORT_UNSUBSCRIBE_LIST = "/unsubscribe/import-list/{baseId}";
export declare const importUnsubscribeListRoSchema: z.ZodObject<{
    notify: z.ZodObject<{
        token: z.ZodString;
        size: z.ZodNumber;
        url: z.ZodString;
        path: z.ZodString;
        mimetype: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        presignedUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        token: string;
        path: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    }, {
        url: string;
        token: string;
        path: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    notify: {
        url: string;
        token: string;
        path: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    };
}, {
    notify: {
        url: string;
        token: string;
        path: string;
        size: number;
        mimetype: string;
        presignedUrl: string;
        width?: number | undefined;
        height?: number | undefined;
    };
}>;
export type ImportUnsubscribeListRo = z.infer<typeof importUnsubscribeListRoSchema>;
export declare const importUnsubscribeListRoute: RouteConfig;
export declare const importUnsubscribeList: (baseId: string, importUnsubscribeListRo: ImportUnsubscribeListRo) => Promise<import("axios").AxiosResponse<boolean, any>>;
