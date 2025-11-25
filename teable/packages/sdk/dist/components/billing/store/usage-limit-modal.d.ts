export declare enum UsageLimitModalType {
    Upgrade = "upgrade",
    User = "user"
}
interface IUsageLimitModalState {
    modalType: UsageLimitModalType;
    modalOpen: boolean;
    openModal: (modalType: UsageLimitModalType) => void;
    closeModal: () => void;
    toggleModal: (open: boolean) => void;
}
export declare const useUsageLimitModalStore: import("zustand").UseBoundStore<import("zustand").StoreApi<IUsageLimitModalState>>;
export {};
