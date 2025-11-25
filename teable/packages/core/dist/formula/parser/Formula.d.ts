import { ATN } from "antlr4ts/atn/ATN";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { RuleContext } from "antlr4ts/RuleContext";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { FormulaVisitor } from "./FormulaVisitor";
export declare class Formula extends Parser {
    static readonly BLOCK_COMMENT = 1;
    static readonly LINE_COMMENT = 2;
    static readonly WHITESPACE = 3;
    static readonly TRUE = 4;
    static readonly FALSE = 5;
    static readonly FIELD = 6;
    static readonly COMMA = 7;
    static readonly COLON = 8;
    static readonly COLON_COLON = 9;
    static readonly DOLLAR = 10;
    static readonly DOLLAR_DOLLAR = 11;
    static readonly STAR = 12;
    static readonly OPEN_PAREN = 13;
    static readonly CLOSE_PAREN = 14;
    static readonly OPEN_BRACKET = 15;
    static readonly CLOSE_BRACKET = 16;
    static readonly L_CURLY = 17;
    static readonly R_CURLY = 18;
    static readonly BIT_STRING = 19;
    static readonly REGEX_STRING = 20;
    static readonly NUMERIC_LITERAL = 21;
    static readonly INTEGER_LITERAL = 22;
    static readonly HEX_INTEGER_LITERAL = 23;
    static readonly DOT = 24;
    static readonly SINGLEQ_STRING_LITERAL = 25;
    static readonly DOUBLEQ_STRING_LITERAL = 26;
    static readonly IDENTIFIER_VARIABLE = 27;
    static readonly IDENTIFIER_UNICODE = 28;
    static readonly IDENTIFIER = 29;
    static readonly AMP = 30;
    static readonly AMP_AMP = 31;
    static readonly AMP_LT = 32;
    static readonly AT_AT = 33;
    static readonly AT_GT = 34;
    static readonly AT_SIGN = 35;
    static readonly BANG = 36;
    static readonly BANG_BANG = 37;
    static readonly BANG_EQUAL = 38;
    static readonly CARET = 39;
    static readonly EQUAL = 40;
    static readonly EQUAL_GT = 41;
    static readonly GT = 42;
    static readonly GTE = 43;
    static readonly GT_GT = 44;
    static readonly HASH = 45;
    static readonly HASH_EQ = 46;
    static readonly HASH_GT = 47;
    static readonly HASH_GT_GT = 48;
    static readonly HASH_HASH = 49;
    static readonly HYPHEN_GT = 50;
    static readonly HYPHEN_GT_GT = 51;
    static readonly HYPHEN_PIPE_HYPHEN = 52;
    static readonly LT = 53;
    static readonly LTE = 54;
    static readonly LT_AT = 55;
    static readonly LT_CARET = 56;
    static readonly LT_GT = 57;
    static readonly LT_HYPHEN_GT = 58;
    static readonly LT_LT = 59;
    static readonly LT_LT_EQ = 60;
    static readonly LT_QMARK_GT = 61;
    static readonly MINUS = 62;
    static readonly PERCENT = 63;
    static readonly PIPE = 64;
    static readonly PIPE_PIPE = 65;
    static readonly PIPE_PIPE_SLASH = 66;
    static readonly PIPE_SLASH = 67;
    static readonly PLUS = 68;
    static readonly QMARK = 69;
    static readonly QMARK_AMP = 70;
    static readonly QMARK_HASH = 71;
    static readonly QMARK_HYPHEN = 72;
    static readonly QMARK_PIPE = 73;
    static readonly SLASH = 74;
    static readonly TIL = 75;
    static readonly TIL_EQ = 76;
    static readonly TIL_GTE_TIL = 77;
    static readonly TIL_GT_TIL = 78;
    static readonly TIL_LTE_TIL = 79;
    static readonly TIL_LT_TIL = 80;
    static readonly TIL_STAR = 81;
    static readonly TIL_TIL = 82;
    static readonly SEMI = 83;
    static readonly ErrorCharacter = 84;
    static readonly RULE_root = 0;
    static readonly RULE_expr = 1;
    static readonly RULE_ws_or_comment = 2;
    static readonly RULE_field_reference = 3;
    static readonly RULE_field_reference_curly = 4;
    static readonly RULE_func_name = 5;
    static readonly RULE_identifier = 6;
    static readonly ruleNames: string[];
    private static readonly _LITERAL_NAMES;
    private static readonly _SYMBOLIC_NAMES;
    static readonly VOCABULARY: Vocabulary;
    get vocabulary(): Vocabulary;
    get grammarFileName(): string;
    get ruleNames(): string[];
    get serializedATN(): string;
    protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException;
    constructor(input: TokenStream);
    root(): RootContext;
    expr(): ExprContext;
    expr(_p: number): ExprContext;
    ws_or_comment(): Ws_or_commentContext;
    field_reference(): Field_referenceContext;
    field_reference_curly(): Field_reference_curlyContext;
    func_name(): Func_nameContext;
    identifier(): IdentifierContext;
    sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean;
    private expr_sempred;
    static readonly _serializedATN: string;
    static __ATN: ATN;
    static get _ATN(): ATN;
}
export declare class RootContext extends ParserRuleContext {
    expr(): ExprContext;
    EOF(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class ExprContext extends ParserRuleContext {
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    copyFrom(ctx: ExprContext): void;
}
export declare class StringLiteralContext extends ExprContext {
    SINGLEQ_STRING_LITERAL(): TerminalNode | undefined;
    DOUBLEQ_STRING_LITERAL(): TerminalNode | undefined;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class IntegerLiteralContext extends ExprContext {
    INTEGER_LITERAL(): TerminalNode;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class DecimalLiteralContext extends ExprContext {
    NUMERIC_LITERAL(): TerminalNode;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class BooleanLiteralContext extends ExprContext {
    TRUE(): TerminalNode | undefined;
    FALSE(): TerminalNode | undefined;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class LeftWhitespaceOrCommentsContext extends ExprContext {
    ws_or_comment(): Ws_or_commentContext;
    expr(): ExprContext;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class RightWhitespaceOrCommentsContext extends ExprContext {
    expr(): ExprContext;
    ws_or_comment(): Ws_or_commentContext;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class BracketsContext extends ExprContext {
    OPEN_PAREN(): TerminalNode;
    expr(): ExprContext;
    CLOSE_PAREN(): TerminalNode;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class UnaryOpContext extends ExprContext {
    MINUS(): TerminalNode;
    expr(): ExprContext;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class BinaryOpContext extends ExprContext {
    _op: Token;
    expr(): ExprContext[];
    expr(i: number): ExprContext;
    SLASH(): TerminalNode | undefined;
    STAR(): TerminalNode | undefined;
    PERCENT(): TerminalNode | undefined;
    PLUS(): TerminalNode | undefined;
    MINUS(): TerminalNode | undefined;
    GT(): TerminalNode | undefined;
    LT(): TerminalNode | undefined;
    GTE(): TerminalNode | undefined;
    LTE(): TerminalNode | undefined;
    EQUAL(): TerminalNode | undefined;
    BANG_EQUAL(): TerminalNode | undefined;
    AMP_AMP(): TerminalNode | undefined;
    PIPE_PIPE(): TerminalNode | undefined;
    AMP(): TerminalNode | undefined;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class FieldReferenceCurlyContext extends ExprContext {
    field_reference_curly(): Field_reference_curlyContext;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class FunctionCallContext extends ExprContext {
    func_name(): Func_nameContext;
    OPEN_PAREN(): TerminalNode;
    CLOSE_PAREN(): TerminalNode;
    expr(): ExprContext[];
    expr(i: number): ExprContext;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    constructor(ctx: ExprContext);
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class Ws_or_commentContext extends ParserRuleContext {
    BLOCK_COMMENT(): TerminalNode | undefined;
    LINE_COMMENT(): TerminalNode | undefined;
    WHITESPACE(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class Field_referenceContext extends ParserRuleContext {
    IDENTIFIER_UNICODE(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class Field_reference_curlyContext extends ParserRuleContext {
    IDENTIFIER_VARIABLE(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class Func_nameContext extends ParserRuleContext {
    identifier(): IdentifierContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
export declare class IdentifierContext extends ParserRuleContext {
    IDENTIFIER(): TerminalNode | undefined;
    IDENTIFIER_UNICODE(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    accept<Result>(visitor: FormulaVisitor<Result>): Result;
}
