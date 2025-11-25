import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import type { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import type { FieldReferenceCurlyContext } from './parser/Formula';
export declare class ConversionVisitor extends AbstractParseTreeVisitor<void> {
    private conversionMap;
    private noThrow;
    private result;
    defaultResult(): undefined;
    constructor(conversionMap: {
        [fieldName: string]: string;
    });
    safe(): this;
    visitFieldReferenceCurly(ctx: FieldReferenceCurlyContext): void;
    visitTerminal(node: TerminalNode): void;
    getResult(): string;
}
