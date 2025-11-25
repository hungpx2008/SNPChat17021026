import { useActionListener } from './use-presence';
export const useViewListener = (viewId, matches, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
cb) => {
    return useActionListener(viewId, matches, cb);
};
