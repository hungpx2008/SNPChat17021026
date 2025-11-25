export declare const splitRange: (start: number, end: number, parts: number) => number[];
export declare const reorder: (dragElemSize: number, dropIndex: number, totalSize: number, getOrder: (index: number) => number) => number[];
export declare const swapReorder: (dragElemSize: number, fromIndex: number, dropIndex: number, totalSize: number, getOrder: (index: number) => number) => number[];
export declare const insertSingle: (insertAt: number, totalSize: number, getOrder: (index: number) => number, isInsertAfter?: boolean) => number;
