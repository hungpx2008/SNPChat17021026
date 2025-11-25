import type { IConjunction } from '@teable/core';
interface IConjunctionSelectProps {
    value: IConjunction;
    onSelect: (val: IConjunction | null) => void;
}
declare function ConjunctionSelect(props: IConjunctionSelectProps): import("react/jsx-runtime").JSX.Element;
export { ConjunctionSelect };
