import React from 'react';
export interface IStandaloneViewProvider {
    baseId: string | undefined;
    tableId: string | undefined;
    viewId?: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}
export declare const StandaloneViewProvider: React.FC<IStandaloneViewProvider>;
