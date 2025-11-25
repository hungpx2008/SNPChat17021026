import { create } from 'zustand';
export const useBuildBaseAgentStore = create()((set) => ({
    building: false,
    setBuilding: (building) => set({ building }),
    tableId: undefined,
    setTableId: (tableId) => set({ tableId }),
    displayRecord: [],
    setDisplayRecord: (displayRecord) => set({ displayRecord }),
    displayTables: [],
    setDisplayTables: (displayTables) => set({ displayTables }),
    displayViews: [],
    setDisplayViews: (displayViews) => set({ displayViews }),
    displayFieldIds: [],
    setDisplayFieldIds: (displayFieldIds) => set({ displayFieldIds }),
}));
