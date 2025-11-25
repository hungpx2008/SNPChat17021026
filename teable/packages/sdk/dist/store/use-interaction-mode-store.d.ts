export declare enum InteractionMode {
    Mouse = "mouse",
    Touch = "touch",
    System = "system"
}
interface IInteractionModeState {
    interactionMode: InteractionMode;
    updateInteractionMode: (type: InteractionMode) => void;
}
export declare const useInteractionModeStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<IInteractionModeState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<IInteractionModeState, IInteractionModeState>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: IInteractionModeState) => void) => () => void;
        onFinishHydration: (fn: (state: IInteractionModeState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<IInteractionModeState, IInteractionModeState>>;
    };
}>;
export {};
