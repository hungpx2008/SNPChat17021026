import type { IConjunction } from '@teable/core';
import type { IBaseIndexProps, IFilterPath } from '../types';
interface IConjunctionProps extends IBaseIndexProps {
    path: IFilterPath;
    value: IConjunction;
}
declare const Conjunction: (props: IConjunctionProps) => import("react/jsx-runtime").JSX.Element;
export { Conjunction };
