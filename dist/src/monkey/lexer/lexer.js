import { TokenType, lookupIdentifier } from "../token/token";
export class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.readPosition = 0;
        this.char = '';
        this.readChar();
    }
    readChar() {
        if (this.readPosition >= this.input.length) {
            this.char = "\0";
        }
        else {
            this.char = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition += 1;
    }
    nextToken() {
        let token;
        this.skipWhitespace();
        switch (this.char) {
            case "=":
                if (this.peekChar() == "=") {
                    this.readChar();
                    token = newToken(TokenType.Equal, "==");
                }
                else {
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
                if (this.peekChar() == "=") {
                    this.readChar();
                    token = newToken(TokenType.NotEqual, "!=");
                }
                else {
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
            case '"':
                token = newToken(TokenType.String, this.readString());
                break;
            case "[":
                token = newToken(TokenType.LBracket, this.char);
                break;
            case "]":
                token = newToken(TokenType.RBracket, this.char);
                break;
            case ":":
                token = newToken(TokenType.Colon, this.char);
                break;
            default: {
                if (isLetter(this.char)) {
                    return this.readIdentifier();
                }
                else if (isDigit(this.char)) {
                    return newToken(TokenType.Int, this.readInteger());
                }
                else {
                    return newToken(TokenType.Illegal, this.char);
                }
            }
        }
        this.readChar();
        return token;
    }
    readIdentifier() {
        const position = this.position;
        while (isLetter(this.char)) {
            this.readChar();
        }
        const literal = this.input.slice(position, this.position);
        return lookupIdentifier(literal);
    }
    peekChar() {
        if (this.readPosition >= this.input.length) {
            return "\0";
        }
        else {
            return this.input[this.readPosition];
        }
    }
    skipWhitespace() {
        while (this.char === " " || this.char === "\t" || this.char === "\n" || this.char === "\r") {
            this.readChar();
        }
    }
    readInteger() {
        const position = this.position;
        while (isDigit(this.char)) {
            this.readChar();
        }
        return this.input.slice(position, this.position);
    }
    readString() {
        const position = this.position + 1;
        while (true) {
            this.readChar();
            if (this.char === '"' || this.char === "\0")
                break;
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
export function isLetter(character) {
    const char = character.charCodeAt(0);
    return aCh <= char && zCh >= char || ACh <= char && ZCh >= char || char === _Ch;
}
export function isDigit(character) {
    const char = character.charCodeAt(0);
    return _0Ch <= char && _9Ch >= char;
}
export function newToken(type, literal) {
    return { type: type, literal: literal };
}
