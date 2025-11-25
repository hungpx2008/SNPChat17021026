import { createContext, useContext } from 'react';
export const confirmModalContext = createContext(null);
export const useConfirmModal = () => {
    const context = useContext(confirmModalContext);
    if (!context) {
        throw new Error('useConfirmModal must be used within ConfirmModalProvider');
    }
    return context;
};
