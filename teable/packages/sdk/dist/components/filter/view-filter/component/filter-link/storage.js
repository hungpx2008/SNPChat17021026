import { LRUCache } from 'lru-cache';
// key is tableId-recordId, value is record name
export const StorageLinkSelected = new LRUCache({
    max: 30,
});
