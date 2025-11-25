export const isAncestorOfActiveElement = (id) => {
    let activeElement = document.activeElement;
    while (activeElement) {
        if (activeElement.id === id) {
            return true;
        }
        activeElement = activeElement.parentElement;
    }
    return false;
};
