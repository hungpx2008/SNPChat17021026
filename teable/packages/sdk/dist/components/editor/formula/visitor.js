import { FunctionCallContext } from '@teable/core';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
export class FormulaNodePathVisitor extends AbstractParseTreeVisitor {
    pathNodes = [];
    targetPosition;
    constructor(position) {
        super();
        this.targetPosition = position;
    }
    defaultResult() {
        return undefined;
    }
    isPositionWithinRange(start, stop) {
        return start <= this.targetPosition && stop >= this.targetPosition;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visitIfPositionInRange(ctx) {
        if (!ctx.start || !ctx.stop)
            return;
        const start = ctx.start.startIndex;
        const stop = ctx.stop.stopIndex;
        if (this.isPositionWithinRange(start, stop)) {
            this.pathNodes.push(ctx);
            this.visitChildren(ctx);
        }
    }
    visitTerminal(node) {
        const start = node.symbol.startIndex;
        const stop = node.symbol.stopIndex;
        if (this.isPositionWithinRange(start, stop)) {
            this.pathNodes.push(node);
        }
    }
    visitLeftWhitespaceOrComments(ctx) {
        this.visitIfPositionInRange(ctx);
    }
    visitRightWhitespaceOrComments(ctx) {
        this.visitIfPositionInRange(ctx);
    }
    visitIntegerLiteral(ctx) {
        this.visitIfPositionInRange(ctx);
    }
    visitStringLiteral(ctx) {
        this.visitIfPositionInRange(ctx);
    }
    visitFunctionCall(ctx) {
        this.visitIfPositionInRange(ctx);
    }
    getPathNodes() {
        return this.pathNodes;
    }
    getNearestFunctionNode() {
        for (let i = this.pathNodes.length - 1; i >= 0; i--) {
            const node = this.pathNodes[i];
            if (node instanceof FunctionCallContext) {
                return node;
            }
        }
        return null;
    }
    getNearestFunctionNodeIndex() {
        for (let i = this.pathNodes.length - 1; i >= 0; i--) {
            const node = this.pathNodes[i];
            if (node instanceof FunctionCallContext) {
                return i;
            }
        }
        return -1;
    }
    getParamsIndex() {
        const pathSize = this.pathNodes.length;
        const nearestFuncIndex = this.getNearestFunctionNodeIndex();
        if (nearestFuncIndex > -1 && pathSize) {
            const funcNode = this.pathNodes[nearestFuncIndex];
            const childNode = this.pathNodes[nearestFuncIndex + 1];
            if (funcNode.CLOSE_PAREN() === childNode) {
                return Math.max(funcNode.expr().length - 1, 0);
            }
            const paramIndex = funcNode.expr().indexOf(childNode);
            const commaIndex = funcNode.COMMA().indexOf(childNode);
            return paramIndex > -1 ? paramIndex : commaIndex;
        }
        return -1;
    }
}
