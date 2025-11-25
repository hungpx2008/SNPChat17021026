"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCallCollectorVisitor = void 0;
const AbstractParseTreeVisitor_1 = require("antlr4ts/tree/AbstractParseTreeVisitor");
/**
 * Visitor that collects all function calls from a formula AST
 * This is used to analyze which functions are used in a formula expression.
 */
class FunctionCallCollectorVisitor extends AbstractParseTreeVisitor_1.AbstractParseTreeVisitor {
    defaultResult() {
        return [];
    }
    aggregateResult(aggregate, nextResult) {
        return aggregate.concat(nextResult);
    }
    visitBinaryOp(ctx) {
        // Visit both operands to find nested function calls
        const leftResult = this.visit(ctx.expr(0));
        const rightResult = this.visit(ctx.expr(1));
        return this.aggregateResult(leftResult, rightResult);
    }
    visitUnaryOp(ctx) {
        // Visit the operand to find nested function calls
        return this.visit(ctx.expr());
    }
    visitBrackets(ctx) {
        // Visit the expression inside brackets
        return this.visit(ctx.expr());
    }
    visitFunctionCall(ctx) {
        // Extract function name and parameter count
        const functionName = ctx.func_name().text.toUpperCase();
        const paramCount = ctx.expr().length;
        // Create function call info for this function
        const currentFunction = {
            name: functionName,
            paramCount,
        };
        // Visit all parameters to find nested function calls
        const nestedFunctions = [];
        ctx.expr().forEach((paramCtx) => {
            const paramResult = this.visit(paramCtx);
            nestedFunctions.push(...paramResult);
        });
        // Return current function plus all nested functions
        return [currentFunction, ...nestedFunctions];
    }
    visitLeftWhitespaceOrComments(ctx) {
        // Visit the nested expression
        return this.visit(ctx.expr());
    }
    visitRightWhitespaceOrComments(ctx) {
        // Visit the nested expression
        return this.visit(ctx.expr());
    }
}
exports.FunctionCallCollectorVisitor = FunctionCallCollectorVisitor;
