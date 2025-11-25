/// <reference types="react" />
import type { IViewVo } from '@teable/core';
import type { IViewInstance } from '../../model/view/factory';
interface IViewProxyProps {
    serverData?: IViewVo[];
    children: React.ReactNode;
}
export declare const getViewData: (view?: IViewInstance, initData?: IViewVo[]) => any;
export declare const ShareViewProxy: (props: IViewProxyProps) => import("react/jsx-runtime").JSX.Element;
export {};
