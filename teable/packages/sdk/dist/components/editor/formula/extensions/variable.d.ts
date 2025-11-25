import type { DecorationSet, ViewUpdate } from '@codemirror/view';
import { ViewPlugin } from '@codemirror/view';
export declare const getVariableExtensions: (regexp: RegExp) => ViewPlugin<{
    variables: DecorationSet;
    update(update: ViewUpdate): void;
}>[];
