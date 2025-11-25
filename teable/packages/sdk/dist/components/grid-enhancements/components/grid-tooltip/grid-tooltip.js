import { create } from 'zustand';
export const useGridTooltipStore = create((set) => ({
    openTooltip: (props) => {
        set((state) => {
            return {
                ...state,
                tooltipInfo: props,
            };
        });
    },
    closeTooltip: () => {
        set((state) => {
            if (state.tooltipInfo == null) {
                return state;
            }
            return {
                ...state,
                tooltipInfo: undefined,
            };
        });
    },
}));
