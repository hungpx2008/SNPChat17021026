import { useRef, useEffect } from 'react';
export const useEventListener = (eventName, handler, element, passive, capture = false) => {
    const savedHandler = useRef();
    savedHandler.current = handler;
    useEffect(() => {
        if (element === null || element.addEventListener === undefined)
            return;
        const el = element;
        const eventListener = (event) => {
            savedHandler.current?.call(el, event);
        };
        el.addEventListener(eventName, eventListener, { passive, capture });
        return () => {
            el.removeEventListener(eventName, eventListener, { capture });
        };
    }, [eventName, element, passive, capture]);
};
