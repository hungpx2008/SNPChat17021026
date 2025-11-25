import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocalStorageKeys } from '../../../config';
export const usePersonalViewStore = create()(persist((set, get) => ({
    personalViewMap: {},
    isPersonalView: (viewId) => {
        const state = get();
        return Boolean(state.personalViewMap[viewId]);
    },
    setPersonalViewMap: (viewId, updater) => set((state) => ({
        personalViewMap: {
            ...state.personalViewMap,
            [viewId]: updater(state.personalViewMap[viewId] ?? {}),
        },
    })),
    removePersonalView: (viewId) => set((state) => {
        const { [viewId]: _, ...rest } = state.personalViewMap;
        return { personalViewMap: rest };
    }),
}), {
    name: LocalStorageKeys.PersonalViewMap,
}));
