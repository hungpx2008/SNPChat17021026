/// <reference types="react" />
import type { FunctionName } from '@teable/core';
import type { IFunctionSchema } from '@teable/openapi';
import type { IFunctionMap } from './interface';
export declare const Type2IconMap: {
    Text: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    Numeric: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    DataTime: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    Logical: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    Array: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    System: (props: import("react").SVGProps<SVGSVGElement>) => import("react").JSX.Element;
};
export declare const FOCUS_TOKENS_SET: Set<number>;
export declare const useFunctionsDisplayMap: () => IFunctionMap;
export declare const useFormulaFunctionsMap: () => Map<FunctionName, IFunctionSchema<FunctionName>>;
