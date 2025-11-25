import type { ReactNode } from 'react';
import { LinkListType } from '../../components/editor/link/interface';
export interface ILinkFilterProviderProps {
    filterLinkCellCandidate?: [string, string] | string;
    filterLinkCellSelected?: [string, string] | string;
    selectedRecordIds?: string[];
    listType?: LinkListType;
    children?: ReactNode;
}
export declare const LinkFilterProvider: React.FC<ILinkFilterProviderProps>;
