"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newToken = exports.isDigit = exports.isLetter = exports.Lexer = void 0;
var token_1 = require("../token/token");
var Lexer = /** @class */ (function () {
    function Lexer(input) {
        this.input = input;
        this.position = 0;
        this.readPosition = 0;
        this.char = '';
        this.readChar();
    }
    Lexer.prototype.readChar = function () {
        if (this.readPosition >= this.input.length) {
            this.char = "\0";
        }
        else {
            this.char = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition += 1;
    };
    Lexer.prototype.nextToken = function () {
        var token;
        this.skipWhitespace();
        switch (this.char) {
            case "=":
                if (this.peekChar() == "=") {
                    this.readChar();
                    token = newToken(token_1.TokenType.Equal, "==");
                }
                else {
                    token = newToken(token_1.TokenType.Assign, this.char);
                }
                break;
            case "+":
                token = newToken(token_1.TokenType.Plus, this.char);
                break;
            case "-":
                token = newToken(token_1.TokenType.Minus, this.char);
                break;
            case "!":
                if (this.peekChar() == "=") {
                    this.readChar();
                    token = newToken(token_1.TokenType.NotEqual, "!=");
                }
                else {
                    token = newToken(token_1.TokenType.Excl, this.char);
                }
                break;
            case "*":
                token = newToken(token_1.TokenType.Asterisk, this.char);
                break;
            case "/":
                token = newToken(token_1.TokenType.SlashF, this.char);
                break;
            case "<":
                token = newToken(token_1.TokenType.Lt, this.char);
                break;
            case ">":
                token = newToken(token_1.TokenType.Gt, this.char);
                break;
            case ",":
                token = newToken(token_1.TokenType.Comma, this.char);
                break;
            case ";":
                token = newToken(token_1.TokenType.Semicolon, this.char);
                break;
            case "(":
                token = newToken(token_1.TokenType.LParen, this.char);
                break;
            case ")":
                token = newToken(token_1.TokenType.RParen, this.char);
                break;
            case "{":
                token = newToken(token_1.TokenType.LBrace, this.char);
                break;
            case "}":
                token = newToken(token_1.TokenType.RBrace, this.char);
                break;
            case "\0":
                token = newToken(token_1.TokenType.Eof, "eof");
                break;
            default: {
                if (isLetter(this.char)) {
                    return this.readIdentifier();
                }
                else if (isDigit(this.char)) {
                    return newToken(token_1.TokenType.Int, this.readInteger());
                }
                else {
                    return newToken(token_1.TokenType.Illegal, this.char);
                }
            }
        }
        this.readChar();
        return token;
    };
    Lexer.prototype.readIdentifier = function () {
        var position = this.position;
        while (isLetter(this.char)) {
            this.readChar();
        }
        var literal = this.input.slice(position, this.position);
        return (0, token_1.lookupIdentifier)(literal);
    };
    Lexer.prototype.peekChar = function () {
        if (this.readPosition >= this.input.length) {
            return "\0";
        }
        else {
            return this.input[this.readPosition];
        }
    };
    Lexer.prototype.skipWhitespace = function () {
        while (this.char === " " || this.char === "\t" || this.char === "\n" || this.char === "\r") {
            this.readChar();
        }
    };
    Lexer.prototype.readInteger = function () {
        var position = this.position;
        while (isDigit(this.char)) {
            this.readChar();
        }
        return this.input.slice(position, this.position);
    };
    return Lexer;
}());
exports.Lexer = Lexer;
var _0Ch = "0".charCodeAt(0);
var _9Ch = "9".charCodeAt(0);
var aCh = "a".charCodeAt(0);
var zCh = "z".charCodeAt(0);
var ACh = "A".charCodeAt(0);
var ZCh = "Z".charCodeAt(0);
var _Ch = "_".charCodeAt(0);
function isLetter(character) {
    var char = character.charCodeAt(0);
    return aCh <= char && zCh >= char || ACh <= char && ZCh >= char || char === _Ch;
}
exports.isLetter = isLetter;
function isDigit(character) {
    var char = character.charCodeAt(0);
    return _0Ch <= char && _9Ch >= char;
}
exports.isDigit = isDigit;
function newToken(type, literal) {
    return { type: type, literal: literal };
}
exports.newToken = newToken;
