export class OpListenersManager {
    opListeners = new Map();
    collection;
    constructor(collection) {
        this.collection = collection;
    }
    add(doc, handler) {
        if (this.opListeners.has(doc.id)) {
            return;
        }
        doc.on('op batch', handler);
        this.opListeners.set(doc.id, () => {
            doc.removeListener('op batch', handler);
            doc.listenerCount('op batch') === 0 && doc.destroy();
        });
    }
    remove(doc) {
        const cleanupFunction = this.opListeners.get(doc.id);
        cleanupFunction && cleanupFunction();
        this.opListeners.delete(doc.id);
    }
    clear() {
        this.opListeners.forEach((cleanupFunction) => cleanupFunction());
        this.opListeners.clear();
    }
}
