import type { IConfirmModalOptions } from './context';
export declare const useConfirm: () => {
    confirm: (options: Omit<IConfirmModalOptions, 'onConfirm' | 'onCancel'>) => Promise<boolean>;
};
export declare const useConfirmWithCallback: () => {
    confirmWithCallback: (options: IConfirmModalOptions) => void;
};
