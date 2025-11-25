import { useActionListener } from './use-presence';
export const useTableListener = (tableId, matches, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
cb) => {
    return useActionListener(tableId, matches, cb);
};
