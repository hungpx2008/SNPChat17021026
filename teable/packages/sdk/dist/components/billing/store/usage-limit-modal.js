import { create } from 'zustand';
export var UsageLimitModalType;
(function (UsageLimitModalType) {
    UsageLimitModalType["Upgrade"] = "upgrade";
    UsageLimitModalType["User"] = "user";
})(UsageLimitModalType || (UsageLimitModalType = {}));
export const useUsageLimitModalStore = create((set) => ({
    modalType: UsageLimitModalType.Upgrade,
    modalOpen: false,
    openModal: () => {
        set((state) => {
            return {
                ...state,
                modalOpen: true,
            };
        });
    },
    closeModal: () => {
        set((state) => {
            return {
                ...state,
                modalOpen: false,
            };
        });
    },
    toggleModal: (open) => {
        set((state) => {
            return {
                ...state,
                modalOpen: open,
            };
        });
    },
}));
