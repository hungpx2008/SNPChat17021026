import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import type { BinaryOpContext, BracketsContext, FunctionCallContext, UnaryOpContext, LeftWhitespaceOrCommentsContext, RightWhitespaceOrCommentsContext } from './parser/Formula';
import type { FormulaVisitor } from './parser/FormulaVisitor';
/**
 * Information about a function call found in the formula
 */
export interface IFunctionCallInfo {
    /** Function name in uppercase */
    name: string;
    /** Number of parameters */
    paramCount: number;
}
/**
 * Visitor that collects all function calls from a formula AST
 * This is used to analyze which functions are used in a formula expression.
 */
export declare class FunctionCallCollectorVisitor extends AbstractParseTreeVisitor<IFunctionCallInfo[]> implements FormulaVisitor<IFunctionCallInfo[]> {
    defaultResult(): IFunctionCallInfo[];
    aggregateResult(aggregate: IFunctionCallInfo[], nextResult: IFunctionCallInfo[]): IFunctionCallInfo[];
    visitBinaryOp(ctx: BinaryOpContext): IFunctionCallInfo[];
    visitUnaryOp(ctx: UnaryOpContext): IFunctionCallInfo[];
    visitBrackets(ctx: BracketsContext): IFunctionCallInfo[];
    visitFunctionCall(ctx: FunctionCallContext): IFunctionCallInfo[];
    visitLeftWhitespaceOrComments(ctx: LeftWhitespaceOrCommentsContext): IFunctionCallInfo[];
    visitRightWhitespaceOrComments(ctx: RightWhitespaceOrCommentsContext): IFunctionCallInfo[];
}
