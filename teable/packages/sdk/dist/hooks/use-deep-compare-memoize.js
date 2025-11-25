import { dequal } from 'dequal';
import { useRef } from 'react';
export function useDeepCompareMemoize(value) {
    const ref = useRef(null);
    if (!dequal(value, ref.current)) {
        ref.current = value;
    }
    return ref.current;
}
