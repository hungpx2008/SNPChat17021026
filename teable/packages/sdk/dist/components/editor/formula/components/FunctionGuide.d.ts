import type { FunctionName } from '@teable/core';
import type { IFunctionSchema } from '@teable/openapi';
import type { FC } from 'react';
interface IFunctionGuideProps {
    data: Partial<IFunctionSchema<FunctionName>> | null;
}
export declare const FunctionGuide: FC<IFunctionGuideProps>;
export {};
