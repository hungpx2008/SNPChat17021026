import { QueryClient } from '@tanstack/react-query';
import type { ILocalization } from '@teable/core';
import type { ILocaleFunction } from './i18n';
export declare function toCamelCaseErrorCode(errorCode: string): string;
export declare const getLocalizationMessage: (localization: ILocalization, t: ILocaleFunction, prefix?: string) => string;
export declare const getHttpErrorMessage: (error: unknown, t: ILocaleFunction, prefix?: string) => string;
export declare const errorRequestHandler: (error: unknown, t?: ILocaleFunction) => string | number | undefined;
export declare const createQueryClient: (t?: ILocaleFunction) => QueryClient;
