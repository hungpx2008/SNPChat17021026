import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocalStorageKeys } from '../../../config';
export const useGridCollapsedGroupStore = create()(persist((set, get) => ({
    collapsedGroupMap: {},
    setCollapsedGroupMap: (key, groupIds) => {
        set({
            collapsedGroupMap: {
                ...get().collapsedGroupMap,
                [key]: groupIds,
            },
        });
    },
}), {
    name: LocalStorageKeys.ViewGridCollapsedGroup,
}));
