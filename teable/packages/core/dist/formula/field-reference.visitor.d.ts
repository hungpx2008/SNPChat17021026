import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import type { FieldReferenceCurlyContext } from './parser/Formula';
import type { FormulaVisitor } from './parser/FormulaVisitor';
export declare class FieldReferenceVisitor extends AbstractParseTreeVisitor<string[]> implements FormulaVisitor<string[]> {
    defaultResult(): never[];
    aggregateResult(aggregate: string[], nextResult: string[]): string[];
    visitFieldReferenceCurly(ctx: FieldReferenceCurlyContext): string[];
}
