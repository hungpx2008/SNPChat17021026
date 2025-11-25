import { FunctionCallContext } from '@teable/core';
import type { IntegerLiteralContext, LeftWhitespaceOrCommentsContext, RightWhitespaceOrCommentsContext, StringLiteralContext, FormulaVisitor } from '@teable/core';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import type { ParseTree } from 'antlr4ts/tree/ParseTree';
import type { TerminalNode } from 'antlr4ts/tree/TerminalNode';
export declare class FormulaNodePathVisitor extends AbstractParseTreeVisitor<void> implements FormulaVisitor<void> {
    private pathNodes;
    private targetPosition;
    constructor(position: number);
    protected defaultResult(): undefined;
    private isPositionWithinRange;
    visitIfPositionInRange(ctx: any): void;
    visitTerminal(node: TerminalNode): void;
    visitLeftWhitespaceOrComments(ctx: LeftWhitespaceOrCommentsContext): void;
    visitRightWhitespaceOrComments(ctx: RightWhitespaceOrCommentsContext): void;
    visitIntegerLiteral(ctx: IntegerLiteralContext): void;
    visitStringLiteral(ctx: StringLiteralContext): void;
    visitFunctionCall(ctx: FunctionCallContext): void;
    getPathNodes(): ParseTree[];
    getNearestFunctionNode(): FunctionCallContext | null;
    getNearestFunctionNodeIndex(): number;
    getParamsIndex(): number;
}
