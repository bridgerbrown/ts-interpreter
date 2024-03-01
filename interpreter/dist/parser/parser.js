"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const token_1 = require("../token/token");
const ast_1 = require("../ast/ast");
class Parser {
    constructor(lexer) {
        this.prefixParseFns = new Map([
            [token_1.TokenType.Ident, this.parseIdentifier.bind(this)],
            [token_1.TokenType.Int, this.parseIntegerLiteral.bind(this)],
            [token_1.TokenType.Excl, this.parsePrefixExpression.bind(this)],
            [token_1.TokenType.Minus, this.parsePrefixExpression.bind(this)],
            [token_1.TokenType.True, this.parseBoolean.bind(this)],
            [token_1.TokenType.False, this.parseBoolean.bind(this)],
            [token_1.TokenType.If, this.parseIfExpression.bind(this)],
            [token_1.TokenType.Function, this.parseFunctionLiteral.bind(this)],
            [token_1.TokenType.LParen, this.parseGroupedExpression.bind(this)],
            [token_1.TokenType.String, this.parseStringLiteral.bind(this)],
            [token_1.TokenType.LBracket, this.parseArrayLiteral.bind(this)],
        ]);
        this.infixParseFns = new Map([
            [token_1.TokenType.Plus, this.parseInfixExpression.bind(this)],
            [token_1.TokenType.Minus, this.parseInfixExpression.bind(this)],
            [token_1.TokenType.SlashF, this.parseInfixExpression.bind(this)],
            [token_1.TokenType.Asterisk, this.parseInfixExpression.bind(this)],
            [token_1.TokenType.Equal, this.parseInfixExpression.bind(this)],
            [token_1.TokenType.NotEqual, this.parseInfixExpression.bind(this)],
            [token_1.TokenType.Lt, this.parseInfixExpression.bind(this)],
            [token_1.TokenType.Gt, this.parseInfixExpression.bind(this)],
            [token_1.TokenType.LParen, this.parseCallExpression.bind(this)],
            [token_1.TokenType.LBracket, this.parseIndexExpression.bind(this)]
        ]);
        this.lexer = lexer;
        this.errors = [];
        this.nextToken();
        this.nextToken();
    }
    nextToken() {
        this.currToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    }
    currTokenIs(token) {
        return this.currToken.type === token;
    }
    peekTokenIs(token) {
        return this.peekToken.type === token;
    }
    expectPeek(token) {
        if (this.peekTokenIs(token)) {
            this.nextToken();
            return true;
        }
        else {
            this.peekError(token);
            return false;
        }
    }
    peekError(token) {
        const message = `Expected next token to be ${token}, instead got ${this.peekToken.type}`;
        this.errors.push(message);
    }
    parseProgram() {
        const program = new ast_1.Program();
        while (!this.currTokenIs(token_1.TokenType.Eof)) {
            let statement = this.parseStatement();
            if (statement !== null) {
                program.statements.push(statement);
            }
            this.nextToken();
        }
        return program;
    }
    parseStatement() {
        switch (this.currToken.type) {
            case (token_1.TokenType.Let):
                return this.parseLetStatement();
            case (token_1.TokenType.Return):
                return this.parseReturnStatement();
            default:
                return this.parseExpressionStatement();
        }
    }
    parseLetStatement() {
        if (!this.expectPeek(token_1.TokenType.Ident))
            return null;
        const name = new ast_1.Identifier(this.currToken);
        if (!this.expectPeek(token_1.TokenType.Assign))
            return null;
        this.nextToken();
        const value = this.parseExpression(Precedence.LOWEST);
        if (!this.currTokenIs(token_1.TokenType.Semicolon)) {
            this.nextToken();
        }
        return new ast_1.LetStatement(this.currToken, name, value);
    }
    parseReturnStatement() {
        this.nextToken();
        const returnValue = this.parseExpression(Precedence.LOWEST);
        while (!this.currTokenIs(token_1.TokenType.Semicolon)) {
            this.nextToken();
        }
        return new ast_1.ReturnStatement(this.currToken, returnValue);
    }
    parseIdentifier() {
        return new ast_1.Identifier(this.currToken);
    }
    parseExpressionStatement() {
        const statement = new ast_1.ExpressionStatement(this.currToken, this.parseExpression(Precedence.LOWEST));
        if (this.peekTokenIs(token_1.TokenType.Semicolon)) {
            this.nextToken();
        }
        return statement;
    }
    noPrefixParseFnError(token) {
        const msg = `No prefix parse function for ${token} found.`;
        this.errors.push(msg);
    }
    parseExpression(precedence) {
        const prefix = this.prefixParseFns.get(this.currToken.type);
        if (!prefix) {
            this.noPrefixParseFnError(this.currToken.type);
            return null;
        }
        let leftExp = prefix();
        if (prefix) {
            // console.log(`Parsed Prefix Expression: ${leftExp.string()}`);
        }
        while (!this.peekTokenIs(token_1.TokenType.Semicolon) && precedence < this.peekPrecedence()) {
            const infix = this.infixParseFns.get(this.peekToken.type);
            if (!infix) {
                console.log("No infix");
                return leftExp;
            }
            ;
            this.nextToken();
            leftExp = infix(leftExp);
            // console.log(`Parsed Infix Expression: ${leftExp.string()}`);
        }
        return leftExp;
    }
    parseIntegerLiteral() {
        const value = parseInt(this.currToken.literal, 10);
        if (isNaN(value)) {
            let message = `Could not parse ${this.currToken.literal} as integer.`;
            this.errors.push(message);
        }
        return new ast_1.IntegerLiteral(this.currToken, value);
    }
    checkParserErrors() {
        return this.errors;
    }
    registerPrefix(tokenType, fn) {
        this.prefixParseFns.set(tokenType, fn);
    }
    registerInfix(tokenType, fn) {
        this.infixParseFns.set(tokenType, fn);
    }
    peekPrecedence() {
        const precedence = precedences.get(this.peekToken.type);
        if (precedence !== undefined)
            return precedence;
        return Precedence.LOWEST;
    }
    currPrecedence() {
        const precedence = precedences.get(this.currToken.type);
        if (precedence !== undefined)
            return precedence;
        return Precedence.LOWEST;
    }
    parsePrefixExpression() {
        const expression = new ast_1.PrefixExpression(this.currToken, this.currToken.literal, null);
        this.nextToken();
        expression.right = this.parseExpression(Precedence.PREFIX);
        return expression;
    }
    parseInfixExpression(left) {
        const operator = this.currToken.literal;
        const precedence = this.currPrecedence();
        this.nextToken();
        const right = this.parseExpression(precedence);
        return new ast_1.InfixExpression(this.currToken, operator, left, right);
    }
    parseBoolean() {
        const expression = new ast_1.Boolean(this.currToken, this.currTokenIs(token_1.TokenType.True));
        return expression;
    }
    parseIfExpression() {
        if (!this.expectPeek(token_1.TokenType.LParen))
            return null;
        this.nextToken();
        const condition = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(token_1.TokenType.RParen))
            return null;
        if (!this.expectPeek(token_1.TokenType.LBrace))
            return null;
        const consequence = this.parseBlockStatement();
        let alternative;
        if (this.peekTokenIs(token_1.TokenType.Else)) {
            this.nextToken();
            if (!this.expectPeek(token_1.TokenType.LBrace))
                return null;
            alternative = this.parseBlockStatement();
        }
        return new ast_1.IfExpression(this.currToken, condition, consequence, alternative);
    }
    parseBlockStatement() {
        const block = new ast_1.BlockStatement(this.currToken, []);
        this.nextToken();
        while (!this.currTokenIs(token_1.TokenType.RBrace) && !this.currTokenIs(token_1.TokenType.Eof)) {
            let statement = this.parseStatement();
            if (statement !== null) {
                block.statements.push(statement);
            }
            this.nextToken();
        }
        return block;
    }
    parseFunctionLiteral() {
        if (!this.expectPeek(token_1.TokenType.LParen)) {
            this.errors.push("Unexpected function syntax, right parenthesis should come after 'fn'");
            return null;
        }
        const parameters = this.parseFunctionParameters();
        if (!this.expectPeek(token_1.TokenType.LBrace))
            return null;
        const body = this.parseBlockStatement();
        return new ast_1.FunctionLiteral(this.currToken, parameters, body);
    }
    parseFunctionParameters() {
        const identifiers = [];
        if (this.peekTokenIs(token_1.TokenType.RParen)) {
            this.nextToken();
            return identifiers;
        }
        this.nextToken();
        let ident = new ast_1.Identifier(this.currToken);
        identifiers.push(ident);
        while (this.peekTokenIs(token_1.TokenType.Comma)) {
            this.nextToken();
            this.nextToken();
            if (this.currTokenIs(token_1.TokenType.Ident)) {
                ident = new ast_1.Identifier(this.currToken);
                identifiers.push(ident);
            }
            else {
                return null;
            }
        }
        if (!this.expectPeek(token_1.TokenType.RParen))
            return null;
        return identifiers;
    }
    parseCallExpression(fn) {
        return new ast_1.CallExpression(this.currToken, fn, this.parseExpressionList(token_1.TokenType.RParen));
    }
    parseCallArguments() {
        const args = [];
        if (this.peekTokenIs(token_1.TokenType.RParen)) {
            this.nextToken();
            return args;
        }
        this.nextToken();
        args.push(this.parseExpression(Precedence.LOWEST));
        while (this.peekTokenIs(token_1.TokenType.Comma)) {
            this.nextToken();
            this.nextToken();
            args.push(this.parseExpression(Precedence.LOWEST));
        }
        if (!this.expectPeek(token_1.TokenType.RParen))
            return null;
        return args;
    }
    parseGroupedExpression() {
        this.nextToken();
        let exp = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(token_1.TokenType.RParen))
            return null;
        return exp;
    }
    parseStringLiteral() {
        return new ast_1.StringLiteral(this.currToken, this.currToken.literal);
    }
    parseArrayLiteral() {
        return new ast_1.ArrayLiteral(this.currToken, this.parseExpressionList(token_1.TokenType.RBracket));
    }
    parseExpressionList(end) {
        const list = [];
        if (this.peekTokenIs(end)) {
            this.nextToken();
            return list;
        }
        this.nextToken();
        list.push(this.parseExpression(Precedence.LOWEST));
        while (this.peekTokenIs(token_1.TokenType.Comma)) {
            this.nextToken();
            this.nextToken();
            list.push(this.parseExpression(Precedence.LOWEST));
        }
        if (!this.expectPeek(end))
            return null;
        return list;
    }
    parseIndexExpression(left) {
        const exp = new ast_1.IndexExpression(this.currToken, left, null);
        this.nextToken();
        exp.index = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(token_1.TokenType.RBracket))
            return null;
        return exp;
    }
}
exports.Parser = Parser;
var Precedence;
(function (Precedence) {
    Precedence[Precedence["LOWEST"] = 0] = "LOWEST";
    Precedence[Precedence["EQUALS"] = 1] = "EQUALS";
    Precedence[Precedence["LESSGREATER"] = 2] = "LESSGREATER";
    Precedence[Precedence["SUM"] = 3] = "SUM";
    Precedence[Precedence["PRODUCT"] = 4] = "PRODUCT";
    Precedence[Precedence["PREFIX"] = 5] = "PREFIX";
    Precedence[Precedence["CALL"] = 6] = "CALL";
    Precedence[Precedence["INDEX"] = 7] = "INDEX";
})(Precedence || (Precedence = {}));
const precedences = new Map([
    [token_1.TokenType.Equal, Precedence.EQUALS],
    [token_1.TokenType.NotEqual, Precedence.EQUALS],
    [token_1.TokenType.Lt, Precedence.LESSGREATER],
    [token_1.TokenType.Gt, Precedence.LESSGREATER],
    [token_1.TokenType.Plus, Precedence.SUM],
    [token_1.TokenType.Minus, Precedence.SUM],
    [token_1.TokenType.SlashF, Precedence.PRODUCT],
    [token_1.TokenType.Asterisk, Precedence.PRODUCT],
    [token_1.TokenType.LParen, Precedence.CALL],
    [token_1.TokenType.LBracket, Precedence.INDEX],
]);
