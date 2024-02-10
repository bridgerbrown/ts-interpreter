"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var token_1 = require("../token/token");
var ast_1 = require("../ast/ast");
var Parser = /** @class */ (function () {
    function Parser(lexer) {
        this.prefixParseFns = new Map([
            [token_1.TokenType.Ident, this.parseIdentifier.bind(this)],
            [token_1.TokenType.Int, this.parseIntegerLiteral.bind(this)],
            [token_1.TokenType.Excl, this.parsePrefixExpression.bind(this)],
            [token_1.TokenType.Minus, this.parsePrefixExpression.bind(this)],
            [token_1.TokenType.True, this.parseBoolean.bind(this)],
            [token_1.TokenType.False, this.parseBoolean.bind(this)],
            [token_1.TokenType.If, this.parseIfExpression.bind(this)],
            [token_1.TokenType.Function, this.parseFunctionLiteral.bind(this)],
            [token_1.TokenType.LParen, this.parseGroupedExpression.bind(this)]
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
            [token_1.TokenType.LParen, this.parseCallExpression.bind(this)]
        ]);
        this.lexer = lexer;
        this.errors = [];
        this.nextToken();
        this.nextToken();
    }
    Parser.prototype.nextToken = function () {
        this.currToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    };
    Parser.prototype.currTokenIs = function (token) {
        return this.currToken.type === token;
    };
    Parser.prototype.peekTokenIs = function (token) {
        return this.peekToken.type === token;
    };
    Parser.prototype.expectPeek = function (token) {
        if (this.peekTokenIs(token)) {
            this.nextToken();
            return true;
        }
        else {
            this.peekError(token);
            return false;
        }
    };
    Parser.prototype.peekError = function (token) {
        var message = "Expected next token to be ".concat(token, ", instead got ").concat(this.peekToken.type);
        this.errors.push(message);
    };
    Parser.prototype.parseProgram = function () {
        var program = new ast_1.Program();
        while (!this.currTokenIs(token_1.TokenType.Eof)) {
            var statement = this.parseStatement();
            if (statement !== null) {
                program.statements.push(statement);
            }
            this.nextToken();
        }
        return program;
    };
    Parser.prototype.parseStatement = function () {
        switch (this.currToken.type) {
            case (token_1.TokenType.Let):
                return this.parseLetStatement();
            case (token_1.TokenType.Return):
                return this.parseReturnStatement();
            default:
                return this.parseExpressionStatement();
        }
    };
    Parser.prototype.parseLetStatement = function () {
        if (!this.expectPeek(token_1.TokenType.Ident))
            return null;
        var name = new ast_1.Identifier(this.currToken);
        if (!this.expectPeek(token_1.TokenType.Assign))
            return null;
        this.nextToken();
        var value = this.parseExpression(Precedence.LOWEST);
        if (!this.currTokenIs(token_1.TokenType.Semicolon)) {
            this.nextToken();
        }
        return new ast_1.LetStatement(this.currToken, name, value);
    };
    Parser.prototype.parseReturnStatement = function () {
        this.nextToken();
        var returnValue = this.parseExpression(Precedence.LOWEST);
        while (!this.currTokenIs(token_1.TokenType.Semicolon)) {
            this.nextToken();
        }
        return new ast_1.ReturnStatement(this.currToken, returnValue);
    };
    Parser.prototype.parseIdentifier = function () {
        return new ast_1.Identifier(this.currToken);
    };
    Parser.prototype.parseExpressionStatement = function () {
        var statement = new ast_1.ExpressionStatement(this.currToken, this.parseExpression(Precedence.LOWEST));
        if (this.peekTokenIs(token_1.TokenType.Semicolon)) {
            this.nextToken();
        }
        return statement;
    };
    Parser.prototype.noPrefixParseFnError = function (token) {
        var msg = "No prefix parse function for ".concat(token, " found.");
        this.errors.push(msg);
    };
    Parser.prototype.parseExpression = function (precedence) {
        var prefix = this.prefixParseFns.get(this.currToken.type);
        if (!prefix) {
            this.noPrefixParseFnError(this.currToken.type);
            return null;
        }
        var leftExp = prefix();
        if (prefix) {
            console.log("Parsed Prefix Expression: ".concat(leftExp.string()));
        }
        while (!this.peekTokenIs(token_1.TokenType.Semicolon) && precedence < this.peekPrecedence()) {
            var infix = this.infixParseFns.get(this.peekToken.type);
            if (!infix) {
                console.log("No infix");
                return leftExp;
            }
            ;
            this.nextToken();
            leftExp = infix(leftExp);
            console.log("Parsed Infix Expression: ".concat(leftExp.string()));
        }
        return leftExp;
    };
    Parser.prototype.parseIntegerLiteral = function () {
        var value = parseInt(this.currToken.literal, 10);
        if (isNaN(value)) {
            var message = "Could not parse ".concat(this.currToken.literal, " as integer.");
            this.errors.push(message);
        }
        return new ast_1.IntegerLiteral(this.currToken, value);
    };
    Parser.prototype.checkParserErrors = function () {
        return this.errors;
    };
    Parser.prototype.registerPrefix = function (tokenType, fn) {
        this.prefixParseFns.set(tokenType, fn);
    };
    Parser.prototype.registerInfix = function (tokenType, fn) {
        this.infixParseFns.set(tokenType, fn);
    };
    Parser.prototype.peekPrecedence = function () {
        var precedence = precedences.get(this.peekToken.type);
        if (precedence !== undefined)
            return precedence;
        return Precedence.LOWEST;
    };
    Parser.prototype.currPrecedence = function () {
        var precedence = precedences.get(this.currToken.type);
        if (precedence !== undefined)
            return precedence;
        return Precedence.LOWEST;
    };
    Parser.prototype.parsePrefixExpression = function () {
        var expression = new ast_1.PrefixExpression(this.currToken, this.currToken.literal, null);
        this.nextToken();
        expression.right = this.parseExpression(Precedence.PREFIX);
        return expression;
    };
    Parser.prototype.parseInfixExpression = function (left) {
        var operator = this.currToken.literal;
        var precedence = this.currPrecedence();
        this.nextToken();
        var right = this.parseExpression(precedence);
        return new ast_1.InfixExpression(this.currToken, operator, left, right);
    };
    Parser.prototype.parseBoolean = function () {
        var expression = new ast_1.Boolean(this.currToken, this.currTokenIs(token_1.TokenType.True));
        return expression;
    };
    Parser.prototype.parseIfExpression = function () {
        if (!this.expectPeek(token_1.TokenType.LParen))
            return null;
        this.nextToken();
        var condition = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(token_1.TokenType.RParen))
            return null;
        if (!this.expectPeek(token_1.TokenType.LBrace))
            return null;
        var consequence = this.parseBlockStatement();
        var alternative;
        if (this.peekTokenIs(token_1.TokenType.Else)) {
            this.nextToken();
            if (!this.expectPeek(token_1.TokenType.LBrace))
                return null;
            alternative = this.parseBlockStatement();
        }
        return new ast_1.IfExpression(this.currToken, condition, consequence, alternative);
    };
    Parser.prototype.parseBlockStatement = function () {
        var block = new ast_1.BlockStatement(this.currToken, []);
        this.nextToken();
        while (!this.currTokenIs(token_1.TokenType.RBrace) && !this.currTokenIs(token_1.TokenType.Eof)) {
            var statement = this.parseStatement();
            if (statement !== null) {
                block.statements.push(statement);
            }
            this.nextToken();
        }
        return block;
    };
    Parser.prototype.parseFunctionLiteral = function () {
        if (!this.expectPeek(token_1.TokenType.LParen))
            return null;
        var parameters = this.parseFunctionParameters();
        if (!this.expectPeek(token_1.TokenType.LBrace))
            return null;
        var body = this.parseBlockStatement();
        return new ast_1.FunctionLiteral(this.currToken, parameters, body);
    };
    Parser.prototype.parseFunctionParameters = function () {
        var identifiers = [];
        if (this.peekTokenIs(token_1.TokenType.RParen)) {
            this.nextToken();
            return identifiers;
        }
        this.nextToken();
        var ident = new ast_1.Identifier(this.currToken);
        identifiers.push(ident);
        while (this.peekTokenIs(token_1.TokenType.Comma)) {
            this.nextToken();
            this.nextToken();
            ident = new ast_1.Identifier(this.currToken);
            identifiers.push(ident);
        }
        if (!this.expectPeek(token_1.TokenType.RParen))
            return null;
        return identifiers;
    };
    Parser.prototype.parseCallExpression = function (fn) {
        return new ast_1.CallExpression(this.currToken, fn, this.parseCallArguments());
    };
    Parser.prototype.parseCallArguments = function () {
        var args = [];
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
    };
    Parser.prototype.parseGroupedExpression = function () {
        this.nextToken();
        var exp = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(token_1.TokenType.RParen))
            return null;
        return exp;
    };
    return Parser;
}());
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
})(Precedence || (Precedence = {}));
var precedences = new Map([
    [token_1.TokenType.Equal, Precedence.EQUALS],
    [token_1.TokenType.NotEqual, Precedence.EQUALS],
    [token_1.TokenType.Lt, Precedence.LESSGREATER],
    [token_1.TokenType.Gt, Precedence.LESSGREATER],
    [token_1.TokenType.Plus, Precedence.SUM],
    [token_1.TokenType.Minus, Precedence.SUM],
    [token_1.TokenType.SlashF, Precedence.PRODUCT],
    [token_1.TokenType.Asterisk, Precedence.PRODUCT],
    [token_1.TokenType.LParen, Precedence.CALL],
]);
