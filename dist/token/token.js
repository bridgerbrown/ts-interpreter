"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupIdentifier = exports.keywords = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType["Illegal"] = "ILLEGAL";
    TokenType["Eof"] = "EOF";
    TokenType["Ident"] = "IDENT";
    TokenType["String"] = "STRING";
    TokenType["Int"] = "INT";
    TokenType["Assign"] = "=";
    TokenType["Plus"] = "+";
    TokenType["Minus"] = "-";
    TokenType["Excl"] = "!";
    TokenType["Asterisk"] = "*";
    TokenType["SlashF"] = "/";
    TokenType["Equal"] = "==";
    TokenType["NotEqual"] = "!=";
    TokenType["Lt"] = "<";
    TokenType["Gt"] = ">";
    TokenType["Comma"] = ",";
    TokenType["Semicolon"] = ";";
    TokenType["LParen"] = "(";
    TokenType["RParen"] = ")";
    TokenType["LBrace"] = "{";
    TokenType["RBrace"] = "}";
    TokenType["LBracket"] = "[";
    TokenType["RBracket"] = "]";
    TokenType["Function"] = "FUNCTION";
    TokenType["Let"] = "LET";
    TokenType["True"] = "TRUE";
    TokenType["False"] = "FALSE";
    TokenType["If"] = "IF";
    TokenType["Else"] = "ELSE";
    TokenType["Return"] = "RETURN";
})(TokenType || (exports.TokenType = TokenType = {}));
;
exports.keywords = new Map([
    ["fn", TokenType.Function],
    ["let", TokenType.Let],
    ["true", TokenType.True],
    ["false", TokenType.False],
    ["if", TokenType.If],
    ["else", TokenType.Else],
    ["return", TokenType.Return],
]);
var lookupIdentifier = function (literal) {
    var type = exports.keywords.get(literal);
    if (type) {
        return { type: type, literal: literal };
    }
    return { type: TokenType.Ident, literal: literal };
};
exports.lookupIdentifier = lookupIdentifier;
