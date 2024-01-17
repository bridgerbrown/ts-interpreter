import { TokenType } from "../../token/token";
import { Lexer } from "../lexer";

test("test nextToken()", function() {
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
  `;

  const lexer = new Lexer(input);

  const tokens = [
      {type: TokenType.Let, literal: "let"},
      { type: TokenType.Ident, literal: "five" },
      {type: TokenType.Assign, literal: "="},
      { type: TokenType.Int, literal: "5" },
      {type: TokenType.Semicolon, literal: ";"},
      {type: TokenType.Let, literal: "let"},
      { type: TokenType.Ident, literal: "ten" },
      {type: TokenType.Assign, literal: "="},
      { type: TokenType.Int, literal: "10" },
      {type: TokenType.Semicolon, literal: ";"},
      {type: TokenType.Let, literal: "let"},
      { type: TokenType.Ident, literal: "add" },
      {type: TokenType.Assign, literal: "="},
      {type: TokenType.Function, literal: "fn"},
      {type: TokenType.LParen, literal: "("},
      { type: TokenType.Ident, literal: "x" },
      {type: TokenType.Comma, literal: ","},
      { type: TokenType.Ident, literal: "y" },
      {type: TokenType.RParen, literal: ")"},
      {type: TokenType.LBrace, literal: "{"},
      { type: TokenType.Ident, literal: "x" },
      {type: TokenType.Plus, literal: "+"},
      { type: TokenType.Ident, literal: "y" },
      {type: TokenType.Semicolon, literal: ";"},
      {type: TokenType.RBrace, literal: "}"},
      {type: TokenType.Semicolon, literal: ";"},
      {type: TokenType.Let, literal: "let"},
      { type: TokenType.Ident, literal: "result" },
      {type: TokenType.Assign, literal: "="},
      { type: TokenType.Ident, literal: "add" },
      {type: TokenType.LParen, literal: "("},
      { type: TokenType.Ident, literal: "five" },
      {type: TokenType.Comma, literal: ","},
      { type: TokenType.Ident, literal: "ten" },
      {type: TokenType.RParen, literal: ")"},
      {type: TokenType.Semicolon, literal: ";"},

      {type: TokenType.Excl, literal: "!"},
      {type: TokenType.Minus, literal: "-"},
      {type: TokenType.SlashF, literal: "/"},
      {type: TokenType.Asterisk, literal: "*"},
      { type: TokenType.Int, literal: "5" },
      {type: TokenType.Semicolon, literal: ";"},
      { type: TokenType.Int, literal: "5" },
      {type: TokenType.Lt, literal: "<"},
      { type: TokenType.Int, literal: "10" },
      {type: TokenType.Gt, literal: ">"},
      { type: TokenType.Int, literal: "5" },
      {type: TokenType.Semicolon, literal: ";"},

      {type: TokenType.If, literal: "if"},
      {type: TokenType.LParen, literal: "("},
      { type: TokenType.Int, literal: "5" },
      {type: TokenType.Lt, literal: "<"},
      { type: TokenType.Int, literal: "10" },
      {type: TokenType.RParen, literal: ")"},
      {type: TokenType.LBrace, literal: "{"},
      {type: TokenType.Return, literal: "return"},
      {type: TokenType.True, literal: "true"},
      {type: TokenType.Semicolon, literal: ";"},
      {type: TokenType.RBrace, literal: "}"},
      {type: TokenType.Else, literal: "else"},
      {type: TokenType.LBrace, literal: "{"},
      {type: TokenType.Return, literal: "return"},
      {type: TokenType.False, literal: "false"},
      {type: TokenType.Semicolon, literal: ";"},
      {type: TokenType.RBrace, literal: "}"},

      { type: TokenType.Int, literal: "10" },
      {type: TokenType.Equal, literal: "=="},
      { type: TokenType.Int, literal: "10" },
      {type: TokenType.Semicolon, literal: ";"},
      { type: TokenType.Int, literal: "10" },
      {type: TokenType.NotEqual, literal: "!="},
      { type: TokenType.Int, literal: "9" },
      {type: TokenType.Semicolon, literal: ";"},

      {type: TokenType.Eof, literal: "eof"},
  ];

  for (const token of tokens) {
    expect(lexer.nextToken().type).toBe(token.type);
  }
})
