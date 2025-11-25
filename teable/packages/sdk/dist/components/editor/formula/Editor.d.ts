import type { FC } from 'react';
interface IFormulaEditorProps {
    expression?: string;
    onConfirm?: (expression: string) => void;
    enableAI?: boolean;
}
export declare const FormulaEditor: FC<IFormulaEditorProps>;
export {};
