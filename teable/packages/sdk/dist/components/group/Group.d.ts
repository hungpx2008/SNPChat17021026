import type { IGroup } from '@teable/core';
import React from 'react';
interface IGroupProps {
    group: IGroup | null;
    children: (text: string, isActive: boolean) => React.ReactElement;
    onChange: (group: IGroup | null) => void;
}
export declare const Group: (props: IGroupProps) => import("react/jsx-runtime").JSX.Element;
export {};
