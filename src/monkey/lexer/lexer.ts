import { TokenType } from "../token/token";

type TokenItem = typeof TokenType[keyof typeof TokenType];

export type Token = {
  type: TokenItem;
  literal: string;
}

export function newToken(type: TokenItem, literal: string): Token {
  return { type, literal };
}

const Keywords = {
  "fn": newToken(TokenType.Function, "fn"),
  "let": newToken(TokenType.Function, "let"),
  "return": newToken(TokenType.Function, "return"),
  "true": newToken(TokenType.Function, "true"),
  "false": newToken(TokenType.Function, "false"),
  "if": newToken(TokenType.Function, "if"),
  "else": newToken(TokenType.Function, "else"),
} as const;

const _0Ch = "0".charCodeAt(0);
const _9Ch = "9".charCodeAt(0);
const aCh = "a".charCodeAt(0);
const zCh = "z".charCodeAt(0);
const ACh = "A".charCodeAt(0);
const ZCh = "Z".charCodeAt(0);
const _Ch = "_".charCodeAt(0);

export function isLetter(character: string): boolean {
  const char = character.charCodeAt(0);
  return aCh <= char && zCh >= char || ACh <= char && ZCh >= char || char === _Ch;
}

export function isDigit(character: string): boolean {
  const char = character.charCodeAt(0);
  return _0Ch <= char && _9Ch >= char;
} 

export class Tokenizer {
  private position: number = 0;
  private readPosition: number = 0;
  private char!: string;
  constructor(private input: string) {
    this.readChar();
  }

  public readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.char + "\0";
    } else {
      this.char = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition += 1;
  }

  public nextToken(): Token {
    let token: Token | undefined;
    this.skipWhitespace();
    
    switch (this.char) {
      case "=":
        token = newToken(TokenType.Assign, this.char);
        break;
      case "+":
        token = newToken(TokenType.Plus, this.char);
        break;
      case ",":
        token = newToken(TokenType.Comma, this.char);
        break;
      case ";":
        token = newToken(TokenType.Semicolon, this.char);
        break;
      case "(":
        token = newToken(TokenType.LParen, this.char);
        break;
      case ")":
        token = newToken(TokenType.RParen, this.char);
        break;
      case "{":
        token = newToken(TokenType.LBrace, this.char);
        break;
      case "}":
        token = newToken(TokenType.RBrace, this.char);
        break;
      case "\0":
        token = newToken(TokenType.Eof, "eof");
        break;
    }

    if (isLetter(this.char)) {
      const identifier = this.readIdentifier();
      const keyword = Keywords[identifier as keyof typeof Keywords];
      if (keyword) {
        return keyword;
      } else if (isDigit(this.char)) {
        return newToken(TokenType.Int, this.readInteger());
      } else {
        return newToken(TokenType.Ident, identifier);
      }
    } else if (!token) {
      return newToken(TokenType.Illegal, this.char);
    }

    this.readChar();
    return token as Token;
  }

  private readIdentifier(): string {
    const position = this.position;
    while (isLetter(this.char)) {
      this.readChar();
    }
    return this.input.slice(position, this.position)
  }

  private skipWhitespace(): void {
    while (this.char === " " || this.char === "\t" || this.char === "\n" || this.char === "\r") {
      this.readChar();
    }
  }

  private readInteger(): string {
    const position = this.position;
    while (isDigit(this.char)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }
}
