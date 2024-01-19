export const TokenType = {
  Illegal: "ILLEGAL",
  Eof: "EOF",
  
  Ident: "IDENT",
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

export const keywords = new Map<string, TokenItem>([
  ["fn", TokenType.Function],
  ["let", TokenType.Let],
  ["true", TokenType.True],
  ["false", TokenType.False],
  ["if", TokenType.If],
  ["else", TokenType.Else],
  ["return", TokenType.Return],
]);

export const lookupIdentifier = (literal: string): Token => {
  const type = keywords.get(literal);
  if (type) {
    return { type, literal };
  }
  return { type: TokenType.Ident, literal };
};
