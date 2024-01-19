import { TokenType, keywords, Token, TokenItem, lookupIdentifier } from "../token/token";

export class Lexer {
  private position: number;
  private readPosition: number;
  private char!: string;

  public constructor(private input: string) {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.char = '';
    this.readChar();
  }

  public readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.char = "\0";
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
        if (this.peek() == "=") {
          this.readChar();
          token = newToken(TokenType.Equal, "==");
        } else {
          token = newToken(TokenType.Assign, this.char); 
        }
        break;
      case "+":
        token = newToken(TokenType.Plus, this.char);
        break;
      case "-":
        token = newToken(TokenType.Minus, this.char);
        break;
      case "!":
        if (this.peek() == "=") {
          this.readChar();
          token = newToken(TokenType.NotEqual, "!=");
        } else {
          token = newToken(TokenType.Excl, this.char); 
        }
        break;
      case "*":
        token = newToken(TokenType.Asterisk, this.char);
        break;
      case "/":
        token = newToken(TokenType.SlashF, this.char);
        break;
      case "<":
        token = newToken(TokenType.Lt, this.char);
        break;
      case ">":
        token = newToken(TokenType.Gt, this.char);
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
      default: {
        if (isLetter(this.char)) {
          return this.readIdentifier();
        } else if (isDigit(this.char)) {
          return newToken(TokenType.Int, this.readInteger());
        } else if (!token) {
          return newToken(TokenType.Illegal, this.char);
        }
      }
    }

    this.readChar();
    return token as Token;
  }

  public readIdentifier(): Token {
    const position = this.position - 1;
    while (isLetter(this.char)) {
      this.readChar();
    }
    const literal = this.input.substring(position, this.position - 1);
    return lookupIdentifier(literal);
  }

  private peek(): string {
    if (this.readPosition >= this.input.length) {
      return "\0";
    } else {
      return this.input[this.readPosition];
    }
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

export function newToken(type: TokenItem, literal: string): Token {
  return { type: type, literal: literal };
}
