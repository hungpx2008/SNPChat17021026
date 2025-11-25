"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversionVisitor = void 0;
const AbstractParseTreeVisitor_1 = require("antlr4ts/tree/AbstractParseTreeVisitor");
class ConversionVisitor extends AbstractParseTreeVisitor_1.AbstractParseTreeVisitor {
    conversionMap;
    noThrow = false;
    result = '';
    defaultResult() {
        return undefined;
    }
    constructor(conversionMap) {
        super();
        this.conversionMap = conversionMap;
        this.conversionMap = conversionMap;
    }
    safe() {
        this.noThrow = true;
        return this;
    }
    visitFieldReferenceCurly(ctx) {
        const originalText = ctx.text;
        let idOrName = originalText;
        if (originalText[0] === '{' && originalText[originalText.length - 1] === '}') {
            idOrName = idOrName.slice(1, -1);
        }
        const nameOrId = this.conversionMap[idOrName] || '#Error';
        if (this.conversionMap[idOrName] == null) {
            const errorTxt = `Invalid field name or function name: "${idOrName}"`;
            if (this.noThrow) {
                console.error(errorTxt);
            }
            else {
                throw new Error(errorTxt);
            }
        }
        this.result += `{${nameOrId}}`;
    }
    visitTerminal(node) {
        const text = node.text;
        if (text === '<EOF>') {
            return;
        }
        this.result += text;
    }
    getResult() {
        return this.result;
    }
}
exports.ConversionVisitor = ConversionVisitor;
