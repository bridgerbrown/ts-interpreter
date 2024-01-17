import { newToken } from "../lexer/lexer";

export const TokenType = {
  Illegal: "ILLEGAL",
  Eof: "EOF",
  
  Ident: "Ident",
  Int: "INT",
  
  Assign: "=",
  Plus: "+",
  Minus: "-",
  Excl: "!",
  Asterisk: "*",
  SlashF: "/",
  Equal: "==",
  NotEqual: "!=",

  Lt: "<",
  Gt: ">",
  Comma: ",",
  Semicolon: ";",
  LParen: "(",
  RParen: ")",
  LBrace: "{",
  RBrace: "}",

  Function: "FUNCTION",
  Let: "LET",
  True: "TRUE",
  False: "FALSE",
  If: "IF",
  Else: "ELSE",
  Return: "RETURN"
} as const;

export type TokenItem = typeof TokenType[keyof typeof TokenType];
export type Token = {
  type: TokenItem;
  literal: string;
}

export const Keywords = {
  "fn": newToken(TokenType.Function, "fn"),
  "let": newToken(TokenType.Let, "let"),
  "true": newToken(TokenType.True, "true"),
  "false": newToken(TokenType.False, "false"),
  "if": newToken(TokenType.If, "if"),
  "else": newToken(TokenType.Else, "else"),
  "return": newToken(TokenType.Return, "return")
} as const;
