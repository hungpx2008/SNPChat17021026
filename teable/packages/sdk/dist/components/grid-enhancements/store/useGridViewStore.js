import { create } from 'zustand';
export const useGridViewStore = create((set) => ({
    openHeaderMenu: (props) => {
        set((state) => {
            return {
                ...state,
                headerMenu: props,
            };
        });
    },
    closeHeaderMenu: () => {
        set((state) => {
            if (state.headerMenu == null) {
                return state;
            }
            return {
                ...state,
                headerMenu: undefined,
            };
        });
    },
    openRecordMenu: (props) => {
        set((state) => {
            return {
                ...state,
                recordMenu: props,
            };
        });
    },
    closeRecordMenu: () => {
        set((state) => {
            if (state.recordMenu == null) {
                return state;
            }
            return {
                ...state,
                recordMenu: undefined,
            };
        });
    },
    openStatisticMenu: (props) => {
        set((state) => {
            return {
                ...state,
                statisticMenu: props,
            };
        });
    },
    closeStatisticMenu: () => {
        set((state) => {
            if (state.statisticMenu == null) {
                return state;
            }
            return {
                ...state,
                statisticMenu: undefined,
            };
        });
    },
    setSelection: (props) => {
        set((state) => {
            return {
                ...state,
                selection: props,
            };
        });
    },
    openGroupHeaderMenu: (props) => {
        set((state) => {
            return {
                ...state,
                groupHeaderMenu: props,
            };
        });
    },
    closeGroupHeaderMenu: () => {
        set((state) => {
            return {
                ...state,
                groupHeaderMenu: undefined,
            };
        });
    },
}));
