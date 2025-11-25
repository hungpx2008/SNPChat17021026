"use strict";
// Generated from src/formula/parser/Formula.g4 by ANTLR 4.9.0-SNAPSHOT
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierContext = exports.Func_nameContext = exports.Field_reference_curlyContext = exports.Field_referenceContext = exports.Ws_or_commentContext = exports.FunctionCallContext = exports.FieldReferenceCurlyContext = exports.BinaryOpContext = exports.UnaryOpContext = exports.BracketsContext = exports.RightWhitespaceOrCommentsContext = exports.LeftWhitespaceOrCommentsContext = exports.BooleanLiteralContext = exports.DecimalLiteralContext = exports.IntegerLiteralContext = exports.StringLiteralContext = exports.ExprContext = exports.RootContext = exports.Formula = void 0;
const ATN_1 = require("antlr4ts/atn/ATN");
const ATNDeserializer_1 = require("antlr4ts/atn/ATNDeserializer");
const FailedPredicateException_1 = require("antlr4ts/FailedPredicateException");
const NoViableAltException_1 = require("antlr4ts/NoViableAltException");
const Parser_1 = require("antlr4ts/Parser");
const ParserRuleContext_1 = require("antlr4ts/ParserRuleContext");
const ParserATNSimulator_1 = require("antlr4ts/atn/ParserATNSimulator");
const RecognitionException_1 = require("antlr4ts/RecognitionException");
const Token_1 = require("antlr4ts/Token");
const VocabularyImpl_1 = require("antlr4ts/VocabularyImpl");
const Utils = __importStar(require("antlr4ts/misc/Utils"));
class Formula extends Parser_1.Parser {
    static BLOCK_COMMENT = 1;
    static LINE_COMMENT = 2;
    static WHITESPACE = 3;
    static TRUE = 4;
    static FALSE = 5;
    static FIELD = 6;
    static COMMA = 7;
    static COLON = 8;
    static COLON_COLON = 9;
    static DOLLAR = 10;
    static DOLLAR_DOLLAR = 11;
    static STAR = 12;
    static OPEN_PAREN = 13;
    static CLOSE_PAREN = 14;
    static OPEN_BRACKET = 15;
    static CLOSE_BRACKET = 16;
    static L_CURLY = 17;
    static R_CURLY = 18;
    static BIT_STRING = 19;
    static REGEX_STRING = 20;
    static NUMERIC_LITERAL = 21;
    static INTEGER_LITERAL = 22;
    static HEX_INTEGER_LITERAL = 23;
    static DOT = 24;
    static SINGLEQ_STRING_LITERAL = 25;
    static DOUBLEQ_STRING_LITERAL = 26;
    static IDENTIFIER_VARIABLE = 27;
    static IDENTIFIER_UNICODE = 28;
    static IDENTIFIER = 29;
    static AMP = 30;
    static AMP_AMP = 31;
    static AMP_LT = 32;
    static AT_AT = 33;
    static AT_GT = 34;
    static AT_SIGN = 35;
    static BANG = 36;
    static BANG_BANG = 37;
    static BANG_EQUAL = 38;
    static CARET = 39;
    static EQUAL = 40;
    static EQUAL_GT = 41;
    static GT = 42;
    static GTE = 43;
    static GT_GT = 44;
    static HASH = 45;
    static HASH_EQ = 46;
    static HASH_GT = 47;
    static HASH_GT_GT = 48;
    static HASH_HASH = 49;
    static HYPHEN_GT = 50;
    static HYPHEN_GT_GT = 51;
    static HYPHEN_PIPE_HYPHEN = 52;
    static LT = 53;
    static LTE = 54;
    static LT_AT = 55;
    static LT_CARET = 56;
    static LT_GT = 57;
    static LT_HYPHEN_GT = 58;
    static LT_LT = 59;
    static LT_LT_EQ = 60;
    static LT_QMARK_GT = 61;
    static MINUS = 62;
    static PERCENT = 63;
    static PIPE = 64;
    static PIPE_PIPE = 65;
    static PIPE_PIPE_SLASH = 66;
    static PIPE_SLASH = 67;
    static PLUS = 68;
    static QMARK = 69;
    static QMARK_AMP = 70;
    static QMARK_HASH = 71;
    static QMARK_HYPHEN = 72;
    static QMARK_PIPE = 73;
    static SLASH = 74;
    static TIL = 75;
    static TIL_EQ = 76;
    static TIL_GTE_TIL = 77;
    static TIL_GT_TIL = 78;
    static TIL_LTE_TIL = 79;
    static TIL_LT_TIL = 80;
    static TIL_STAR = 81;
    static TIL_TIL = 82;
    static SEMI = 83;
    static ErrorCharacter = 84;
    static RULE_root = 0;
    static RULE_expr = 1;
    static RULE_ws_or_comment = 2;
    static RULE_field_reference = 3;
    static RULE_field_reference_curly = 4;
    static RULE_func_name = 5;
    static RULE_identifier = 6;
    // tslint:disable:no-trailing-whitespace
    static ruleNames = [
        "root", "expr", "ws_or_comment", "field_reference", "field_reference_curly",
        "func_name", "identifier",
    ];
    static _LITERAL_NAMES = [
        undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        "','", "':'", "'::'", "'$'", "'$$'", "'*'", "'('", "')'", "'['", "']'",
        "'{'", "'}'", undefined, undefined, undefined, undefined, undefined, "'.'",
        undefined, undefined, undefined, undefined, undefined, "'&'", "'&&'",
        "'&<'", "'@@'", "'@>'", "'@'", "'!'", "'!!'", "'!='", "'^'", "'='", "'=>'",
        "'>'", "'>='", "'>>'", "'#'", "'#='", "'#>'", "'#>>'", "'##'", "'->'",
        "'->>'", "'-|-'", "'<'", "'<='", "'<@'", "'<^'", "'<>'", "'<->'", "'<<'",
        "'<<='", "'<?>'", "'-'", "'%'", "'|'", "'||'", "'||/'", "'|/'", "'+'",
        "'?'", "'?&'", "'?#'", "'?-'", "'?|'", "'/'", "'~'", "'~='", "'~>=~'",
        "'~>~'", "'~<=~'", "'~<~'", "'~*'", "'~~'", "';'",
    ];
    static _SYMBOLIC_NAMES = [
        undefined, "BLOCK_COMMENT", "LINE_COMMENT", "WHITESPACE", "TRUE", "FALSE",
        "FIELD", "COMMA", "COLON", "COLON_COLON", "DOLLAR", "DOLLAR_DOLLAR", "STAR",
        "OPEN_PAREN", "CLOSE_PAREN", "OPEN_BRACKET", "CLOSE_BRACKET", "L_CURLY",
        "R_CURLY", "BIT_STRING", "REGEX_STRING", "NUMERIC_LITERAL", "INTEGER_LITERAL",
        "HEX_INTEGER_LITERAL", "DOT", "SINGLEQ_STRING_LITERAL", "DOUBLEQ_STRING_LITERAL",
        "IDENTIFIER_VARIABLE", "IDENTIFIER_UNICODE", "IDENTIFIER", "AMP", "AMP_AMP",
        "AMP_LT", "AT_AT", "AT_GT", "AT_SIGN", "BANG", "BANG_BANG", "BANG_EQUAL",
        "CARET", "EQUAL", "EQUAL_GT", "GT", "GTE", "GT_GT", "HASH", "HASH_EQ",
        "HASH_GT", "HASH_GT_GT", "HASH_HASH", "HYPHEN_GT", "HYPHEN_GT_GT", "HYPHEN_PIPE_HYPHEN",
        "LT", "LTE", "LT_AT", "LT_CARET", "LT_GT", "LT_HYPHEN_GT", "LT_LT", "LT_LT_EQ",
        "LT_QMARK_GT", "MINUS", "PERCENT", "PIPE", "PIPE_PIPE", "PIPE_PIPE_SLASH",
        "PIPE_SLASH", "PLUS", "QMARK", "QMARK_AMP", "QMARK_HASH", "QMARK_HYPHEN",
        "QMARK_PIPE", "SLASH", "TIL", "TIL_EQ", "TIL_GTE_TIL", "TIL_GT_TIL", "TIL_LTE_TIL",
        "TIL_LT_TIL", "TIL_STAR", "TIL_TIL", "SEMI", "ErrorCharacter",
    ];
    static VOCABULARY = new VocabularyImpl_1.VocabularyImpl(Formula._LITERAL_NAMES, Formula._SYMBOLIC_NAMES, []);
    // @Override
    // @NotNull
    get vocabulary() {
        return Formula.VOCABULARY;
    }
    // tslint:enable:no-trailing-whitespace
    // @Override
    get grammarFileName() { return "Formula.g4"; }
    // @Override
    get ruleNames() { return Formula.ruleNames; }
    // @Override
    get serializedATN() { return Formula._serializedATN; }
    createFailedPredicateException(predicate, message) {
        return new FailedPredicateException_1.FailedPredicateException(this, predicate, message);
    }
    constructor(input) {
        super(input);
        this._interp = new ParserATNSimulator_1.ParserATNSimulator(Formula._ATN, this);
    }
    // @RuleVersion(0)
    root() {
        let _localctx = new RootContext(this._ctx, this.state);
        this.enterRule(_localctx, 0, Formula.RULE_root);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 14;
                this.expr(0);
                this.state = 15;
                this.match(Formula.EOF);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    expr(_p) {
        if (_p === undefined) {
            _p = 0;
        }
        let _parentctx = this._ctx;
        let _parentState = this.state;
        let _localctx = new ExprContext(this._ctx, _parentState);
        let _prevctx = _localctx;
        let _startState = 2;
        this.enterRecursionRule(_localctx, 2, Formula.RULE_expr, _p);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 47;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case Formula.SINGLEQ_STRING_LITERAL:
                        {
                            _localctx = new StringLiteralContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 18;
                            this.match(Formula.SINGLEQ_STRING_LITERAL);
                        }
                        break;
                    case Formula.DOUBLEQ_STRING_LITERAL:
                        {
                            _localctx = new StringLiteralContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 19;
                            this.match(Formula.DOUBLEQ_STRING_LITERAL);
                        }
                        break;
                    case Formula.INTEGER_LITERAL:
                        {
                            _localctx = new IntegerLiteralContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 20;
                            this.match(Formula.INTEGER_LITERAL);
                        }
                        break;
                    case Formula.NUMERIC_LITERAL:
                        {
                            _localctx = new DecimalLiteralContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 21;
                            this.match(Formula.NUMERIC_LITERAL);
                        }
                        break;
                    case Formula.TRUE:
                    case Formula.FALSE:
                        {
                            _localctx = new BooleanLiteralContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 22;
                            _la = this._input.LA(1);
                            if (!(_la === Formula.TRUE || _la === Formula.FALSE)) {
                                this._errHandler.recoverInline(this);
                            }
                            else {
                                if (this._input.LA(1) === Token_1.Token.EOF) {
                                    this.matchedEOF = true;
                                }
                                this._errHandler.reportMatch(this);
                                this.consume();
                            }
                        }
                        break;
                    case Formula.BLOCK_COMMENT:
                    case Formula.LINE_COMMENT:
                    case Formula.WHITESPACE:
                        {
                            _localctx = new LeftWhitespaceOrCommentsContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 23;
                            this.ws_or_comment();
                            this.state = 24;
                            this.expr(13);
                        }
                        break;
                    case Formula.OPEN_PAREN:
                        {
                            _localctx = new BracketsContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 26;
                            this.match(Formula.OPEN_PAREN);
                            this.state = 27;
                            this.expr(0);
                            this.state = 28;
                            this.match(Formula.CLOSE_PAREN);
                        }
                        break;
                    case Formula.MINUS:
                        {
                            _localctx = new UnaryOpContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 30;
                            this.match(Formula.MINUS);
                            this.state = 31;
                            this.expr(10);
                        }
                        break;
                    case Formula.IDENTIFIER_VARIABLE:
                        {
                            _localctx = new FieldReferenceCurlyContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 32;
                            this.field_reference_curly();
                        }
                        break;
                    case Formula.IDENTIFIER_UNICODE:
                    case Formula.IDENTIFIER:
                        {
                            _localctx = new FunctionCallContext(_localctx);
                            this._ctx = _localctx;
                            _prevctx = _localctx;
                            this.state = 33;
                            this.func_name();
                            this.state = 34;
                            this.match(Formula.OPEN_PAREN);
                            this.state = 43;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Formula.BLOCK_COMMENT) | (1 << Formula.LINE_COMMENT) | (1 << Formula.WHITESPACE) | (1 << Formula.TRUE) | (1 << Formula.FALSE) | (1 << Formula.OPEN_PAREN) | (1 << Formula.NUMERIC_LITERAL) | (1 << Formula.INTEGER_LITERAL) | (1 << Formula.SINGLEQ_STRING_LITERAL) | (1 << Formula.DOUBLEQ_STRING_LITERAL) | (1 << Formula.IDENTIFIER_VARIABLE) | (1 << Formula.IDENTIFIER_UNICODE) | (1 << Formula.IDENTIFIER))) !== 0) || _la === Formula.MINUS) {
                                {
                                    this.state = 35;
                                    this.expr(0);
                                    this.state = 40;
                                    this._errHandler.sync(this);
                                    _la = this._input.LA(1);
                                    while (_la === Formula.COMMA) {
                                        {
                                            {
                                                this.state = 36;
                                                this.match(Formula.COMMA);
                                                this.state = 37;
                                                this.expr(0);
                                            }
                                        }
                                        this.state = 42;
                                        this._errHandler.sync(this);
                                        _la = this._input.LA(1);
                                    }
                                }
                            }
                            this.state = 45;
                            this.match(Formula.CLOSE_PAREN);
                        }
                        break;
                    default:
                        throw new NoViableAltException_1.NoViableAltException(this);
                }
                this._ctx._stop = this._input.tryLT(-1);
                this.state = 74;
                this._errHandler.sync(this);
                _alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
                while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        if (this._parseListeners != null) {
                            this.triggerExitRuleEvent();
                        }
                        _prevctx = _localctx;
                        {
                            this.state = 72;
                            this._errHandler.sync(this);
                            switch (this.interpreter.adaptivePredict(this._input, 3, this._ctx)) {
                                case 1:
                                    {
                                        _localctx = new BinaryOpContext(new ExprContext(_parentctx, _parentState));
                                        this.pushNewRecursionContext(_localctx, _startState, Formula.RULE_expr);
                                        this.state = 49;
                                        if (!(this.precpred(this._ctx, 9))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
                                        }
                                        this.state = 50;
                                        _localctx._op = this._input.LT(1);
                                        _la = this._input.LA(1);
                                        if (!(_la === Formula.STAR || _la === Formula.PERCENT || _la === Formula.SLASH)) {
                                            _localctx._op = this._errHandler.recoverInline(this);
                                        }
                                        else {
                                            if (this._input.LA(1) === Token_1.Token.EOF) {
                                                this.matchedEOF = true;
                                            }
                                            this._errHandler.reportMatch(this);
                                            this.consume();
                                        }
                                        this.state = 51;
                                        this.expr(10);
                                    }
                                    break;
                                case 2:
                                    {
                                        _localctx = new BinaryOpContext(new ExprContext(_parentctx, _parentState));
                                        this.pushNewRecursionContext(_localctx, _startState, Formula.RULE_expr);
                                        this.state = 52;
                                        if (!(this.precpred(this._ctx, 8))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
                                        }
                                        this.state = 53;
                                        _localctx._op = this._input.LT(1);
                                        _la = this._input.LA(1);
                                        if (!(_la === Formula.MINUS || _la === Formula.PLUS)) {
                                            _localctx._op = this._errHandler.recoverInline(this);
                                        }
                                        else {
                                            if (this._input.LA(1) === Token_1.Token.EOF) {
                                                this.matchedEOF = true;
                                            }
                                            this._errHandler.reportMatch(this);
                                            this.consume();
                                        }
                                        this.state = 54;
                                        this.expr(9);
                                    }
                                    break;
                                case 3:
                                    {
                                        _localctx = new BinaryOpContext(new ExprContext(_parentctx, _parentState));
                                        this.pushNewRecursionContext(_localctx, _startState, Formula.RULE_expr);
                                        this.state = 55;
                                        if (!(this.precpred(this._ctx, 7))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
                                        }
                                        this.state = 56;
                                        _localctx._op = this._input.LT(1);
                                        _la = this._input.LA(1);
                                        if (!(((((_la - 42)) & ~0x1F) === 0 && ((1 << (_la - 42)) & ((1 << (Formula.GT - 42)) | (1 << (Formula.GTE - 42)) | (1 << (Formula.LT - 42)) | (1 << (Formula.LTE - 42)))) !== 0))) {
                                            _localctx._op = this._errHandler.recoverInline(this);
                                        }
                                        else {
                                            if (this._input.LA(1) === Token_1.Token.EOF) {
                                                this.matchedEOF = true;
                                            }
                                            this._errHandler.reportMatch(this);
                                            this.consume();
                                        }
                                        this.state = 57;
                                        this.expr(8);
                                    }
                                    break;
                                case 4:
                                    {
                                        _localctx = new BinaryOpContext(new ExprContext(_parentctx, _parentState));
                                        this.pushNewRecursionContext(_localctx, _startState, Formula.RULE_expr);
                                        this.state = 58;
                                        if (!(this.precpred(this._ctx, 6))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
                                        }
                                        this.state = 59;
                                        _localctx._op = this._input.LT(1);
                                        _la = this._input.LA(1);
                                        if (!(_la === Formula.BANG_EQUAL || _la === Formula.EQUAL)) {
                                            _localctx._op = this._errHandler.recoverInline(this);
                                        }
                                        else {
                                            if (this._input.LA(1) === Token_1.Token.EOF) {
                                                this.matchedEOF = true;
                                            }
                                            this._errHandler.reportMatch(this);
                                            this.consume();
                                        }
                                        this.state = 60;
                                        this.expr(7);
                                    }
                                    break;
                                case 5:
                                    {
                                        _localctx = new BinaryOpContext(new ExprContext(_parentctx, _parentState));
                                        this.pushNewRecursionContext(_localctx, _startState, Formula.RULE_expr);
                                        this.state = 61;
                                        if (!(this.precpred(this._ctx, 5))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
                                        }
                                        this.state = 62;
                                        _localctx._op = this.match(Formula.AMP_AMP);
                                        this.state = 63;
                                        this.expr(6);
                                    }
                                    break;
                                case 6:
                                    {
                                        _localctx = new BinaryOpContext(new ExprContext(_parentctx, _parentState));
                                        this.pushNewRecursionContext(_localctx, _startState, Formula.RULE_expr);
                                        this.state = 64;
                                        if (!(this.precpred(this._ctx, 4))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
                                        }
                                        this.state = 65;
                                        _localctx._op = this.match(Formula.PIPE_PIPE);
                                        this.state = 66;
                                        this.expr(5);
                                    }
                                    break;
                                case 7:
                                    {
                                        _localctx = new BinaryOpContext(new ExprContext(_parentctx, _parentState));
                                        this.pushNewRecursionContext(_localctx, _startState, Formula.RULE_expr);
                                        this.state = 67;
                                        if (!(this.precpred(this._ctx, 3))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
                                        }
                                        this.state = 68;
                                        _localctx._op = this.match(Formula.AMP);
                                        this.state = 69;
                                        this.expr(4);
                                    }
                                    break;
                                case 8:
                                    {
                                        _localctx = new RightWhitespaceOrCommentsContext(new ExprContext(_parentctx, _parentState));
                                        this.pushNewRecursionContext(_localctx, _startState, Formula.RULE_expr);
                                        this.state = 70;
                                        if (!(this.precpred(this._ctx, 12))) {
                                            throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
                                        }
                                        this.state = 71;
                                        this.ws_or_comment();
                                    }
                                    break;
                            }
                        }
                    }
                    this.state = 76;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(_parentctx);
        }
        return _localctx;
    }
    // @RuleVersion(0)
    ws_or_comment() {
        let _localctx = new Ws_or_commentContext(this._ctx, this.state);
        this.enterRule(_localctx, 4, Formula.RULE_ws_or_comment);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 77;
                _la = this._input.LA(1);
                if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << Formula.BLOCK_COMMENT) | (1 << Formula.LINE_COMMENT) | (1 << Formula.WHITESPACE))) !== 0))) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    field_reference() {
        let _localctx = new Field_referenceContext(this._ctx, this.state);
        this.enterRule(_localctx, 6, Formula.RULE_field_reference);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 79;
                this.match(Formula.IDENTIFIER_UNICODE);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    field_reference_curly() {
        let _localctx = new Field_reference_curlyContext(this._ctx, this.state);
        this.enterRule(_localctx, 8, Formula.RULE_field_reference_curly);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 81;
                this.match(Formula.IDENTIFIER_VARIABLE);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    func_name() {
        let _localctx = new Func_nameContext(this._ctx, this.state);
        this.enterRule(_localctx, 10, Formula.RULE_func_name);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 83;
                this.identifier();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    identifier() {
        let _localctx = new IdentifierContext(this._ctx, this.state);
        this.enterRule(_localctx, 12, Formula.RULE_identifier);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 85;
                _la = this._input.LA(1);
                if (!(_la === Formula.IDENTIFIER_UNICODE || _la === Formula.IDENTIFIER)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    sempred(_localctx, ruleIndex, predIndex) {
        switch (ruleIndex) {
            case 1:
                return this.expr_sempred(_localctx, predIndex);
        }
        return true;
    }
    expr_sempred(_localctx, predIndex) {
        switch (predIndex) {
            case 0:
                return this.precpred(this._ctx, 9);
            case 1:
                return this.precpred(this._ctx, 8);
            case 2:
                return this.precpred(this._ctx, 7);
            case 3:
                return this.precpred(this._ctx, 6);
            case 4:
                return this.precpred(this._ctx, 5);
            case 5:
                return this.precpred(this._ctx, 4);
            case 6:
                return this.precpred(this._ctx, 3);
            case 7:
                return this.precpred(this._ctx, 12);
        }
        return true;
    }
    static _serializedATN = "\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03VZ\x04\x02\t\x02" +
        "\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07\t\x07" +
        "\x04\b\t\b\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
        "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
        "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x07\x03)" +
        "\n\x03\f\x03\x0E\x03,\v\x03\x05\x03.\n\x03\x03\x03\x03\x03\x05\x032\n" +
        "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
        "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
        "\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x07\x03K\n\x03\f\x03\x0E" +
        "\x03N\v\x03\x03\x04\x03\x04\x03\x05\x03\x05\x03\x06\x03\x06\x03\x07\x03" +
        "\x07\x03\b\x03\b\x03\b\x02\x02\x03\x04\t\x02\x02\x04\x02\x06\x02\b\x02" +
        "\n\x02\f\x02\x0E\x02\x02\t\x03\x02\x06\x07\x05\x02\x0E\x0EAALL\x04\x02" +
        "@@FF\x04\x02,-78\x04\x02((**\x03\x02\x03\x05\x03\x02\x1E\x1F\x02e\x02" +
        "\x10\x03\x02\x02\x02\x041\x03\x02\x02\x02\x06O\x03\x02\x02\x02\bQ\x03" +
        "\x02\x02\x02\nS\x03\x02\x02\x02\fU\x03\x02\x02\x02\x0EW\x03\x02\x02\x02" +
        "\x10\x11\x05\x04\x03\x02\x11\x12\x07\x02\x02\x03\x12\x03\x03\x02\x02\x02" +
        "\x13\x14\b\x03\x01\x02\x142\x07\x1B\x02\x02\x152\x07\x1C\x02\x02\x162" +
        "\x07\x18\x02\x02\x172\x07\x17\x02\x02\x182\t\x02\x02\x02\x19\x1A\x05\x06" +
        "\x04\x02\x1A\x1B\x05\x04\x03\x0F\x1B2\x03\x02\x02\x02\x1C\x1D\x07\x0F" +
        "\x02\x02\x1D\x1E\x05\x04\x03\x02\x1E\x1F\x07\x10\x02\x02\x1F2\x03\x02" +
        "\x02\x02 !\x07@\x02\x02!2\x05\x04\x03\f\"2\x05\n\x06\x02#$\x05\f\x07\x02" +
        "$-\x07\x0F\x02\x02%*\x05\x04\x03\x02&\'\x07\t\x02\x02\')\x05\x04\x03\x02" +
        "(&\x03\x02\x02\x02),\x03\x02\x02\x02*(\x03\x02\x02\x02*+\x03\x02\x02\x02" +
        "+.\x03\x02\x02\x02,*\x03\x02\x02\x02-%\x03\x02\x02\x02-.\x03\x02\x02\x02" +
        "./\x03\x02\x02\x02/0\x07\x10\x02\x0202\x03\x02\x02\x021\x13\x03\x02\x02" +
        "\x021\x15\x03\x02\x02\x021\x16\x03\x02\x02\x021\x17\x03\x02\x02\x021\x18" +
        "\x03\x02\x02\x021\x19\x03\x02\x02\x021\x1C\x03\x02\x02\x021 \x03\x02\x02" +
        "\x021\"\x03\x02\x02\x021#\x03\x02\x02\x022L\x03\x02\x02\x0234\f\v\x02" +
        "\x0245\t\x03\x02\x025K\x05\x04\x03\f67\f\n\x02\x0278\t\x04\x02\x028K\x05" +
        "\x04\x03\v9:\f\t\x02\x02:;\t\x05\x02\x02;K\x05\x04\x03\n<=\f\b\x02\x02" +
        "=>\t\x06\x02\x02>K\x05\x04\x03\t?@\f\x07\x02\x02@A\x07!\x02\x02AK\x05" +
        "\x04\x03\bBC\f\x06\x02\x02CD\x07C\x02\x02DK\x05\x04\x03\x07EF\f\x05\x02" +
        "\x02FG\x07 \x02\x02GK\x05\x04\x03\x06HI\f\x0E\x02\x02IK\x05\x06\x04\x02" +
        "J3\x03\x02\x02\x02J6\x03\x02\x02\x02J9\x03\x02\x02\x02J<\x03\x02\x02\x02" +
        "J?\x03\x02\x02\x02JB\x03\x02\x02\x02JE\x03\x02\x02\x02JH\x03\x02\x02\x02" +
        "KN\x03\x02\x02\x02LJ\x03\x02\x02\x02LM\x03\x02\x02\x02M\x05\x03\x02\x02" +
        "\x02NL\x03\x02\x02\x02OP\t\x07\x02\x02P\x07\x03\x02\x02\x02QR\x07\x1E" +
        "\x02\x02R\t\x03\x02\x02\x02ST\x07\x1D\x02\x02T\v\x03\x02\x02\x02UV\x05" +
        "\x0E\b\x02V\r\x03\x02\x02\x02WX\t\b\x02\x02X\x0F\x03\x02\x02\x02\x07*" +
        "-1JL";
    static __ATN;
    static get _ATN() {
        if (!Formula.__ATN) {
            Formula.__ATN = new ATNDeserializer_1.ATNDeserializer().deserialize(Utils.toCharArray(Formula._serializedATN));
        }
        return Formula.__ATN;
    }
}
exports.Formula = Formula;
class RootContext extends ParserRuleContext_1.ParserRuleContext {
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    EOF() { return this.getToken(Formula.EOF, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return Formula.RULE_root; }
    // @Override
    accept(visitor) {
        if (visitor.visitRoot) {
            return visitor.visitRoot(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RootContext = RootContext;
class ExprContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return Formula.RULE_expr; }
    copyFrom(ctx) {
        super.copyFrom(ctx);
    }
}
exports.ExprContext = ExprContext;
class StringLiteralContext extends ExprContext {
    SINGLEQ_STRING_LITERAL() { return this.tryGetToken(Formula.SINGLEQ_STRING_LITERAL, 0); }
    DOUBLEQ_STRING_LITERAL() { return this.tryGetToken(Formula.DOUBLEQ_STRING_LITERAL, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringLiteral) {
            return visitor.visitStringLiteral(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringLiteralContext = StringLiteralContext;
class IntegerLiteralContext extends ExprContext {
    INTEGER_LITERAL() { return this.getToken(Formula.INTEGER_LITERAL, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitIntegerLiteral) {
            return visitor.visitIntegerLiteral(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.IntegerLiteralContext = IntegerLiteralContext;
class DecimalLiteralContext extends ExprContext {
    NUMERIC_LITERAL() { return this.getToken(Formula.NUMERIC_LITERAL, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDecimalLiteral) {
            return visitor.visitDecimalLiteral(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DecimalLiteralContext = DecimalLiteralContext;
class BooleanLiteralContext extends ExprContext {
    TRUE() { return this.tryGetToken(Formula.TRUE, 0); }
    FALSE() { return this.tryGetToken(Formula.FALSE, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBooleanLiteral) {
            return visitor.visitBooleanLiteral(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BooleanLiteralContext = BooleanLiteralContext;
class LeftWhitespaceOrCommentsContext extends ExprContext {
    ws_or_comment() {
        return this.getRuleContext(0, Ws_or_commentContext);
    }
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitLeftWhitespaceOrComments) {
            return visitor.visitLeftWhitespaceOrComments(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.LeftWhitespaceOrCommentsContext = LeftWhitespaceOrCommentsContext;
class RightWhitespaceOrCommentsContext extends ExprContext {
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    ws_or_comment() {
        return this.getRuleContext(0, Ws_or_commentContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRightWhitespaceOrComments) {
            return visitor.visitRightWhitespaceOrComments(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RightWhitespaceOrCommentsContext = RightWhitespaceOrCommentsContext;
class BracketsContext extends ExprContext {
    OPEN_PAREN() { return this.getToken(Formula.OPEN_PAREN, 0); }
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    CLOSE_PAREN() { return this.getToken(Formula.CLOSE_PAREN, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBrackets) {
            return visitor.visitBrackets(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BracketsContext = BracketsContext;
class UnaryOpContext extends ExprContext {
    MINUS() { return this.getToken(Formula.MINUS, 0); }
    expr() {
        return this.getRuleContext(0, ExprContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitUnaryOp) {
            return visitor.visitUnaryOp(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.UnaryOpContext = UnaryOpContext;
class BinaryOpContext extends ExprContext {
    _op;
    expr(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }
        else {
            return this.getRuleContext(i, ExprContext);
        }
    }
    SLASH() { return this.tryGetToken(Formula.SLASH, 0); }
    STAR() { return this.tryGetToken(Formula.STAR, 0); }
    PERCENT() { return this.tryGetToken(Formula.PERCENT, 0); }
    PLUS() { return this.tryGetToken(Formula.PLUS, 0); }
    MINUS() { return this.tryGetToken(Formula.MINUS, 0); }
    GT() { return this.tryGetToken(Formula.GT, 0); }
    LT() { return this.tryGetToken(Formula.LT, 0); }
    GTE() { return this.tryGetToken(Formula.GTE, 0); }
    LTE() { return this.tryGetToken(Formula.LTE, 0); }
    EQUAL() { return this.tryGetToken(Formula.EQUAL, 0); }
    BANG_EQUAL() { return this.tryGetToken(Formula.BANG_EQUAL, 0); }
    AMP_AMP() { return this.tryGetToken(Formula.AMP_AMP, 0); }
    PIPE_PIPE() { return this.tryGetToken(Formula.PIPE_PIPE, 0); }
    AMP() { return this.tryGetToken(Formula.AMP, 0); }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBinaryOp) {
            return visitor.visitBinaryOp(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BinaryOpContext = BinaryOpContext;
class FieldReferenceCurlyContext extends ExprContext {
    field_reference_curly() {
        return this.getRuleContext(0, Field_reference_curlyContext);
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitFieldReferenceCurly) {
            return visitor.visitFieldReferenceCurly(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.FieldReferenceCurlyContext = FieldReferenceCurlyContext;
class FunctionCallContext extends ExprContext {
    func_name() {
        return this.getRuleContext(0, Func_nameContext);
    }
    OPEN_PAREN() { return this.getToken(Formula.OPEN_PAREN, 0); }
    CLOSE_PAREN() { return this.getToken(Formula.CLOSE_PAREN, 0); }
    expr(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }
        else {
            return this.getRuleContext(i, ExprContext);
        }
    }
    COMMA(i) {
        if (i === undefined) {
            return this.getTokens(Formula.COMMA);
        }
        else {
            return this.getToken(Formula.COMMA, i);
        }
    }
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        this.copyFrom(ctx);
    }
    // @Override
    accept(visitor) {
        if (visitor.visitFunctionCall) {
            return visitor.visitFunctionCall(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.FunctionCallContext = FunctionCallContext;
class Ws_or_commentContext extends ParserRuleContext_1.ParserRuleContext {
    BLOCK_COMMENT() { return this.tryGetToken(Formula.BLOCK_COMMENT, 0); }
    LINE_COMMENT() { return this.tryGetToken(Formula.LINE_COMMENT, 0); }
    WHITESPACE() { return this.tryGetToken(Formula.WHITESPACE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return Formula.RULE_ws_or_comment; }
    // @Override
    accept(visitor) {
        if (visitor.visitWs_or_comment) {
            return visitor.visitWs_or_comment(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.Ws_or_commentContext = Ws_or_commentContext;
class Field_referenceContext extends ParserRuleContext_1.ParserRuleContext {
    IDENTIFIER_UNICODE() { return this.getToken(Formula.IDENTIFIER_UNICODE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return Formula.RULE_field_reference; }
    // @Override
    accept(visitor) {
        if (visitor.visitField_reference) {
            return visitor.visitField_reference(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.Field_referenceContext = Field_referenceContext;
class Field_reference_curlyContext extends ParserRuleContext_1.ParserRuleContext {
    IDENTIFIER_VARIABLE() { return this.getToken(Formula.IDENTIFIER_VARIABLE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return Formula.RULE_field_reference_curly; }
    // @Override
    accept(visitor) {
        if (visitor.visitField_reference_curly) {
            return visitor.visitField_reference_curly(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.Field_reference_curlyContext = Field_reference_curlyContext;
class Func_nameContext extends ParserRuleContext_1.ParserRuleContext {
    identifier() {
        return this.getRuleContext(0, IdentifierContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return Formula.RULE_func_name; }
    // @Override
    accept(visitor) {
        if (visitor.visitFunc_name) {
            return visitor.visitFunc_name(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.Func_nameContext = Func_nameContext;
class IdentifierContext extends ParserRuleContext_1.ParserRuleContext {
    IDENTIFIER() { return this.tryGetToken(Formula.IDENTIFIER, 0); }
    IDENTIFIER_UNICODE() { return this.tryGetToken(Formula.IDENTIFIER_UNICODE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return Formula.RULE_identifier; }
    // @Override
    accept(visitor) {
        if (visitor.visitIdentifier) {
            return visitor.visitIdentifier(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.IdentifierContext = IdentifierContext;
