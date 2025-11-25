"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaErrorListener = void 0;
class FormulaErrorListener {
    syntaxError(_recognizer, _offendingSymbol, line, charPositionInLine, msg, _e) {
        throw new Error(msg.split('expecting')[0].trim());
    }
}
exports.FormulaErrorListener = FormulaErrorListener;
