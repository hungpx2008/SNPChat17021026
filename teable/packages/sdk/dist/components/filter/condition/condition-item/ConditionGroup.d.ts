/// <reference types="react" />
import type { IComponentWithChildren, IBaseFilterComponentProps, IBaseConditionProps } from '../../types';
interface IConditionGroupProps extends IComponentWithChildren, Pick<IBaseFilterComponentProps, 'path'>, IBaseConditionProps {
}
export declare const ConditionGroup: (props: IConditionGroupProps) => import("react/jsx-runtime").JSX.Element;
export declare const ConditionGroupContent: {
    ({ children }: IComponentWithChildren): import("react").ReactNode;
    displayName: string;
};
export {};
