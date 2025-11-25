import { useConfirmModal } from './context';
export const useConfirm = () => {
    const { openModal } = useConfirmModal();
    const confirm = (options) => {
        return new Promise((resolve) => {
            openModal({
                ...options,
                onConfirm: () => {
                    resolve(true);
                },
                onCancel: () => {
                    resolve(false);
                },
            });
        });
    };
    return { confirm };
};
export const useConfirmWithCallback = () => {
    const { openModal } = useConfirmModal();
    const confirmWithCallback = (options) => {
        openModal(options);
    };
    return { confirmWithCallback };
};
