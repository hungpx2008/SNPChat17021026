type IDisplayCellInfo = [number, string];
interface IBuildBaseStore {
    building: boolean;
    setBuilding: (building: boolean) => void;
    tableId: string | undefined;
    setTableId: (tableId: string) => void;
    displayRecord: IDisplayCellInfo[];
    setDisplayRecord: (displayRecord: IDisplayCellInfo[]) => void;
    displayTables: string[];
    setDisplayTables: (displayTables: string[]) => void;
    displayViews: string[];
    setDisplayViews: (displayViews: string[]) => void;
    displayFieldIds: string[];
    setDisplayFieldIds: (displayFieldIds: string[]) => void;
}
export declare const useBuildBaseAgentStore: import("zustand").UseBoundStore<import("zustand").StoreApi<IBuildBaseStore>>;
export {};
