"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../token/token");
const lexer_1 = require("./lexer");
describe("test nextToken()", function () {
    const input = `
    let five = 5;
    let ten = 10;
    let add = fn(x, y) {
     x + y;
    };
    let result = add(five, ten);
    !-/*5;
    5 < 10 > 5;
    if (5 < 10) {
        return true;
    } else {
        return false;
    }

    10 == 10;
    10 != 9;
    "foobar"
    "foo bar"
    [1, 2];
  `;
    const lexer = new lexer_1.Lexer(input);
    const tokens = [
        { type: token_1.TokenType.Let, literal: "let" },
        { type: token_1.TokenType.Ident, literal: "five" },
        { type: token_1.TokenType.Assign, literal: "=" },
        { type: token_1.TokenType.Int, literal: "5" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.Let, literal: "let" },
        { type: token_1.TokenType.Ident, literal: "ten" },
        { type: token_1.TokenType.Assign, literal: "=" },
        { type: token_1.TokenType.Int, literal: "10" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.Let, literal: "let" },
        { type: token_1.TokenType.Ident, literal: "add" },
        { type: token_1.TokenType.Assign, literal: "=" },
        { type: token_1.TokenType.Function, literal: "fn" },
        { type: token_1.TokenType.LParen, literal: "(" },
        { type: token_1.TokenType.Ident, literal: "x" },
        { type: token_1.TokenType.Comma, literal: "," },
        { type: token_1.TokenType.Ident, literal: "y" },
        { type: token_1.TokenType.RParen, literal: ")" },
        { type: token_1.TokenType.LBrace, literal: "{" },
        { type: token_1.TokenType.Ident, literal: "x" },
        { type: token_1.TokenType.Plus, literal: "+" },
        { type: token_1.TokenType.Ident, literal: "y" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.RBrace, literal: "}" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.Let, literal: "let" },
        { type: token_1.TokenType.Ident, literal: "result" },
        { type: token_1.TokenType.Assign, literal: "=" },
        { type: token_1.TokenType.Ident, literal: "add" },
        { type: token_1.TokenType.LParen, literal: "(" },
        { type: token_1.TokenType.Ident, literal: "five" },
        { type: token_1.TokenType.Comma, literal: "," },
        { type: token_1.TokenType.Ident, literal: "ten" },
        { type: token_1.TokenType.RParen, literal: ")" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.Excl, literal: "!" },
        { type: token_1.TokenType.Minus, literal: "-" },
        { type: token_1.TokenType.SlashF, literal: "/" },
        { type: token_1.TokenType.Asterisk, literal: "*" },
        { type: token_1.TokenType.Int, literal: "5" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.Int, literal: "5" },
        { type: token_1.TokenType.Lt, literal: "<" },
        { type: token_1.TokenType.Int, literal: "10" },
        { type: token_1.TokenType.Gt, literal: ">" },
        { type: token_1.TokenType.Int, literal: "5" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.If, literal: "if" },
        { type: token_1.TokenType.LParen, literal: "(" },
        { type: token_1.TokenType.Int, literal: "5" },
        { type: token_1.TokenType.Lt, literal: "<" },
        { type: token_1.TokenType.Int, literal: "10" },
        { type: token_1.TokenType.RParen, literal: ")" },
        { type: token_1.TokenType.LBrace, literal: "{" },
        { type: token_1.TokenType.Return, literal: "return" },
        { type: token_1.TokenType.True, literal: "true" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.RBrace, literal: "}" },
        { type: token_1.TokenType.Else, literal: "else" },
        { type: token_1.TokenType.LBrace, literal: "{" },
        { type: token_1.TokenType.Return, literal: "return" },
        { type: token_1.TokenType.False, literal: "false" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.RBrace, literal: "}" },
        { type: token_1.TokenType.Int, literal: "10" },
        { type: token_1.TokenType.Equal, literal: "==" },
        { type: token_1.TokenType.Int, literal: "10" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.Int, literal: "10" },
        { type: token_1.TokenType.NotEqual, literal: "!=" },
        { type: token_1.TokenType.Int, literal: "9" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.String, literal: "foobar" },
        { type: token_1.TokenType.String, literal: "foo bar" },
        { type: token_1.TokenType.LBracket, literal: "[" },
        { type: token_1.TokenType.Int, literal: "1" },
        { type: token_1.TokenType.Comma, literal: "," },
        { type: token_1.TokenType.Int, literal: "2" },
        { type: token_1.TokenType.RBracket, literal: "]" },
        { type: token_1.TokenType.Semicolon, literal: ";" },
        { type: token_1.TokenType.Eof, literal: "eof" },
    ];
    for (const token of tokens) {
        it(`should assign ${token.literal} to ${token.type}`, () => {
            expect(lexer.nextToken().type).toBe(token.type);
        });
    }
});
