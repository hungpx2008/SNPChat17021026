import type { IGroupPoint } from '../interface';
export interface IGroupIndexCollection {
    value: unknown;
    startIndex: number;
    cumulativeCount: number;
}
export declare const createGroupIndexCollections: (data: IGroupPoint[]) => IGroupIndexCollection[];
export declare const binarySearchIndexPoint: (indexPoints: IGroupIndexCollection[], targetIndex: number) => IGroupIndexCollection | null;
export declare const getInfoByGroupIndexCollections: (groupIndexCollections: IGroupIndexCollection[], targetIndex: number) => {
    value: unknown;
    index: number;
};
