interface IPersonalViewState {
    personalViewMap: Record<string, Record<string, unknown>>;
    isPersonalView: (viewId: string) => boolean;
    setPersonalViewMap: (viewId: string, updater: (prev: Record<string, unknown>) => Record<string, unknown>) => void;
    removePersonalView: (viewId: string) => void;
}
export declare const usePersonalViewStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<IPersonalViewState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<IPersonalViewState, IPersonalViewState>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: IPersonalViewState) => void) => () => void;
        onFinishHydration: (fn: (state: IPersonalViewState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<IPersonalViewState, IPersonalViewState>>;
    };
}>;
export {};
