export declare function useLinkFilter(): {
    setLinkCellCandidate: (...args: any[]) => void;
    setLinkCellSelected: (...args: any[]) => void;
    setListType: (...args: any[]) => void;
    selectedRecordIds?: string[] | undefined;
    filterLinkCellSelected?: string | [string, string] | undefined;
    filterLinkCellCandidate?: string | [string, string] | undefined;
    listType?: import("../components/editor/link/interface").LinkListType | undefined;
    setSelectedRecordIds?: ((selected: string[]) => void) | undefined;
};
