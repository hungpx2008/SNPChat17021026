interface IGridCollapsedGroupState {
    collapsedGroupMap: Record<string, string[]>;
    setCollapsedGroupMap: (key: string, groupIds: string[]) => void;
}
export declare const useGridCollapsedGroupStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<IGridCollapsedGroupState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<IGridCollapsedGroupState, IGridCollapsedGroupState>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: IGridCollapsedGroupState) => void) => () => void;
        onFinishHydration: (fn: (state: IGridCollapsedGroupState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<IGridCollapsedGroupState, IGridCollapsedGroupState>>;
    };
}>;
export {};
