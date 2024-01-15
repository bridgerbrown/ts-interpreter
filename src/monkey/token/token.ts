export const TokenType = {
  Illegal: "ILLEGAL",
  Eof: "EOF",
  
  Ident: "Ident",
  Int: "INT",
  
  Assign: "=",
  Plus: "+",

  Comma: ",",
  Semicolon: ";",
  LParen: "(",
  RParen: ")",
  LBrace: "{",
  RBrace: "}",

  Function: "FUNCTION",
  Let: "LET"
} as const;
