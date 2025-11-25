import type { ExprContext } from './parser/Formula';
/**
 * Parse a formula expression string into an AST
 * @param expression The formula expression to parse
 * @returns The parsed AST root context
 */
export declare function parseFormula(expression: string): ExprContext;
/**
 * Parse a formula expression and convert it to SQL using the provided visitor
 * @param expression The formula expression to parse
 * @param visitor The SQL conversion visitor to use
 * @returns The generated SQL string
 */
export declare function parseFormulaToSQL<T>(expression: string, visitor: {
    visit(tree: ExprContext): T;
}): T;
