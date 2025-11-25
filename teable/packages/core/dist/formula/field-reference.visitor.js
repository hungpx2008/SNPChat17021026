"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldReferenceVisitor = void 0;
const AbstractParseTreeVisitor_1 = require("antlr4ts/tree/AbstractParseTreeVisitor");
class FieldReferenceVisitor extends AbstractParseTreeVisitor_1.AbstractParseTreeVisitor {
    defaultResult() {
        return [];
    }
    aggregateResult(aggregate, nextResult) {
        return aggregate.concat(nextResult);
    }
    visitFieldReferenceCurly(ctx) {
        return [ctx.text.slice(1, -1)];
    }
}
exports.FieldReferenceVisitor = FieldReferenceVisitor;
