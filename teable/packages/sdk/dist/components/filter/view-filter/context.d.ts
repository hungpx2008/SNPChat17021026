import React from 'react';
import type { IFieldInstance } from '../../../model';
import type { IViewFilterLinkContext } from './types';
export interface IViewFilterContext {
    fields: IFieldInstance[];
    viewFilterLinkContext: IViewFilterLinkContext;
}
export declare const ViewFilterContext: React.Context<IViewFilterContext>;
