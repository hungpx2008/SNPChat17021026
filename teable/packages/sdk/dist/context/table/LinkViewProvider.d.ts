import React from 'react';
export interface ILinkViewProvider {
    linkFieldId: string;
    linkBaseId?: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}
export declare const LinkViewProvider: React.FC<ILinkViewProvider>;
