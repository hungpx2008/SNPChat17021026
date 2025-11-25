import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocalStorageKeys } from '../config';
export var InteractionMode;
(function (InteractionMode) {
    InteractionMode["Mouse"] = "mouse";
    InteractionMode["Touch"] = "touch";
    InteractionMode["System"] = "system";
})(InteractionMode || (InteractionMode = {}));
export const useInteractionModeStore = create()(persist((set) => ({
    interactionMode: InteractionMode.System,
    updateInteractionMode: (type) => set({ interactionMode: type }),
}), {
    name: LocalStorageKeys.InteractionMode,
}));
