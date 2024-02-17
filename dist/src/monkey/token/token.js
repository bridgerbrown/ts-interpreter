export var TokenType;
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
    TokenType["Colon"] = ":";
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
})(TokenType || (TokenType = {}));
;
export const keywords = new Map([
    ["fn", TokenType.Function],
    ["let", TokenType.Let],
    ["true", TokenType.True],
    ["false", TokenType.False],
    ["if", TokenType.If],
    ["else", TokenType.Else],
    ["return", TokenType.Return],
]);
export const lookupIdentifier = (literal) => {
    const type = keywords.get(literal);
    if (type) {
        return { type, literal };
    }
    return { type: TokenType.Ident, literal };
};
