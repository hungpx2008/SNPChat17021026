"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFormulaToSQL = exports.parseFormula = void 0;
const antlr4ts_1 = require("antlr4ts");
const Formula_1 = require("./parser/Formula");
const FormulaLexer_1 = require("./parser/FormulaLexer");
/**
 * Parse a formula expression string into an AST
 * @param expression The formula expression to parse
 * @returns The parsed AST root context
 */
function parseFormula(expression) {
    const inputStream = antlr4ts_1.CharStreams.fromString(expression);
    const lexer = new FormulaLexer_1.FormulaLexer(inputStream);
    const tokenStream = new antlr4ts_1.CommonTokenStream(lexer);
    const parser = new Formula_1.Formula(tokenStream);
    return parser.root();
}
exports.parseFormula = parseFormula;
/**
 * Parse a formula expression and convert it to SQL using the provided visitor
 * @param expression The formula expression to parse
 * @param visitor The SQL conversion visitor to use
 * @returns The generated SQL string
 */
function parseFormulaToSQL(expression, visitor) {
    const tree = parseFormula(expression);
    return visitor.visit(tree);
}
exports.parseFormulaToSQL = parseFormulaToSQL;
