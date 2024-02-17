import { TokenType } from "../token/token";
import { Program, LetStatement, Identifier, ReturnStatement, ExpressionStatement, IntegerLiteral, PrefixExpression, InfixExpression, Boolean, IfExpression, BlockStatement, FunctionLiteral, CallExpression, StringLiteral, ArrayLiteral, IndexExpression, HashLiteral } from "../ast/ast";
export class Parser {
    constructor(lexer) {
        this.prefixParseFns = new Map([
            [TokenType.Ident, this.parseIdentifier.bind(this)],
            [TokenType.Int, this.parseIntegerLiteral.bind(this)],
            [TokenType.Excl, this.parsePrefixExpression.bind(this)],
            [TokenType.Minus, this.parsePrefixExpression.bind(this)],
            [TokenType.True, this.parseBoolean.bind(this)],
            [TokenType.False, this.parseBoolean.bind(this)],
            [TokenType.If, this.parseIfExpression.bind(this)],
            [TokenType.Function, this.parseFunctionLiteral.bind(this)],
            [TokenType.LParen, this.parseGroupedExpression.bind(this)],
            [TokenType.String, this.parseStringLiteral.bind(this)],
            [TokenType.LBracket, this.parseArrayLiteral.bind(this)],
            [TokenType.LBrace, this.parseHashLiteral.bind(this)]
        ]);
        this.infixParseFns = new Map([
            [TokenType.Plus, this.parseInfixExpression.bind(this)],
            [TokenType.Minus, this.parseInfixExpression.bind(this)],
            [TokenType.SlashF, this.parseInfixExpression.bind(this)],
            [TokenType.Asterisk, this.parseInfixExpression.bind(this)],
            [TokenType.Equal, this.parseInfixExpression.bind(this)],
            [TokenType.NotEqual, this.parseInfixExpression.bind(this)],
            [TokenType.Lt, this.parseInfixExpression.bind(this)],
            [TokenType.Gt, this.parseInfixExpression.bind(this)],
            [TokenType.LParen, this.parseCallExpression.bind(this)],
            [TokenType.LBracket, this.parseIndexExpression.bind(this)]
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
        const program = new Program();
        while (!this.currTokenIs(TokenType.Eof)) {
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
            case (TokenType.Let):
                return this.parseLetStatement();
            case (TokenType.Return):
                return this.parseReturnStatement();
            default:
                return this.parseExpressionStatement();
        }
    }
    parseLetStatement() {
        if (!this.expectPeek(TokenType.Ident))
            return null;
        const name = new Identifier(this.currToken);
        if (!this.expectPeek(TokenType.Assign))
            return null;
        this.nextToken();
        const value = this.parseExpression(Precedence.LOWEST);
        if (!this.currTokenIs(TokenType.Semicolon)) {
            this.nextToken();
        }
        return new LetStatement(this.currToken, name, value);
    }
    parseReturnStatement() {
        this.nextToken();
        const returnValue = this.parseExpression(Precedence.LOWEST);
        while (!this.currTokenIs(TokenType.Semicolon)) {
            this.nextToken();
        }
        return new ReturnStatement(this.currToken, returnValue);
    }
    parseIdentifier() {
        return new Identifier(this.currToken);
    }
    parseExpressionStatement() {
        const statement = new ExpressionStatement(this.currToken, this.parseExpression(Precedence.LOWEST));
        if (this.peekTokenIs(TokenType.Semicolon)) {
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
        while (!this.peekTokenIs(TokenType.Semicolon) && precedence < this.peekPrecedence()) {
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
        return new IntegerLiteral(this.currToken, value);
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
        const expression = new PrefixExpression(this.currToken, this.currToken.literal, null);
        this.nextToken();
        expression.right = this.parseExpression(Precedence.PREFIX);
        return expression;
    }
    parseInfixExpression(left) {
        const operator = this.currToken.literal;
        const precedence = this.currPrecedence();
        this.nextToken();
        const right = this.parseExpression(precedence);
        return new InfixExpression(this.currToken, operator, left, right);
    }
    parseBoolean() {
        const expression = new Boolean(this.currToken, this.currTokenIs(TokenType.True));
        return expression;
    }
    parseIfExpression() {
        if (!this.expectPeek(TokenType.LParen))
            return null;
        this.nextToken();
        const condition = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(TokenType.RParen))
            return null;
        if (!this.expectPeek(TokenType.LBrace))
            return null;
        const consequence = this.parseBlockStatement();
        let alternative;
        if (this.peekTokenIs(TokenType.Else)) {
            this.nextToken();
            if (!this.expectPeek(TokenType.LBrace))
                return null;
            alternative = this.parseBlockStatement();
        }
        return new IfExpression(this.currToken, condition, consequence, alternative);
    }
    parseBlockStatement() {
        const block = new BlockStatement(this.currToken, []);
        this.nextToken();
        while (!this.currTokenIs(TokenType.RBrace) && !this.currTokenIs(TokenType.Eof)) {
            let statement = this.parseStatement();
            if (statement !== null) {
                block.statements.push(statement);
            }
            this.nextToken();
        }
        return block;
    }
    parseFunctionLiteral() {
        if (!this.expectPeek(TokenType.LParen))
            return null;
        const parameters = this.parseFunctionParameters();
        if (!this.expectPeek(TokenType.LBrace))
            return null;
        const body = this.parseBlockStatement();
        return new FunctionLiteral(this.currToken, parameters, body);
    }
    parseFunctionParameters() {
        const identifiers = [];
        if (this.peekTokenIs(TokenType.RParen)) {
            this.nextToken();
            return identifiers;
        }
        this.nextToken();
        let ident = new Identifier(this.currToken);
        identifiers.push(ident);
        while (this.peekTokenIs(TokenType.Comma)) {
            this.nextToken();
            this.nextToken();
            ident = new Identifier(this.currToken);
            identifiers.push(ident);
        }
        if (!this.expectPeek(TokenType.RParen))
            return null;
        return identifiers;
    }
    parseCallExpression(fn) {
        return new CallExpression(this.currToken, fn, this.parseExpressionList(TokenType.RParen));
    }
    parseCallArguments() {
        const args = [];
        if (this.peekTokenIs(TokenType.RParen)) {
            this.nextToken();
            return args;
        }
        this.nextToken();
        args.push(this.parseExpression(Precedence.LOWEST));
        while (this.peekTokenIs(TokenType.Comma)) {
            this.nextToken();
            this.nextToken();
            args.push(this.parseExpression(Precedence.LOWEST));
        }
        if (!this.expectPeek(TokenType.RParen))
            return null;
        return args;
    }
    parseGroupedExpression() {
        this.nextToken();
        let exp = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(TokenType.RParen))
            return null;
        return exp;
    }
    parseStringLiteral() {
        return new StringLiteral(this.currToken, this.currToken.literal);
    }
    parseArrayLiteral() {
        return new ArrayLiteral(this.currToken, this.parseExpressionList(TokenType.RBracket));
    }
    parseExpressionList(end) {
        const list = [];
        if (this.peekTokenIs(end)) {
            this.nextToken();
            return list;
        }
        this.nextToken();
        list.push(this.parseExpression(Precedence.LOWEST));
        while (this.peekTokenIs(TokenType.Comma)) {
            this.nextToken();
            this.nextToken();
            list.push(this.parseExpression(Precedence.LOWEST));
        }
        if (!this.expectPeek(end))
            return null;
        return list;
    }
    parseIndexExpression(left) {
        const exp = new IndexExpression(this.currToken, left, null);
        this.nextToken();
        exp.index = this.parseExpression(Precedence.LOWEST);
        if (!this.expectPeek(TokenType.RBracket))
            return null;
        return exp;
    }
    parseHashLiteral() {
        const hash = new HashLiteral(this.currToken, new Map());
        while (!this.peekTokenIs(TokenType.RBrace)) {
            this.nextToken();
            const key = this.parseExpression(Precedence.LOWEST);
            if (!this.expectPeek(TokenType.Colon))
                return null;
            this.nextToken();
            const value = this.parseExpression(Precedence.LOWEST);
            if (key)
                hash.pairs.set(key, value);
            if (!this.peekTokenIs(TokenType.RBrace) && !this.expectPeek(TokenType.Comma))
                return null;
        }
        if (!this.expectPeek(TokenType.RBrace))
            return null;
        return hash;
    }
}
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
    [TokenType.Equal, Precedence.EQUALS],
    [TokenType.NotEqual, Precedence.EQUALS],
    [TokenType.Lt, Precedence.LESSGREATER],
    [TokenType.Gt, Precedence.LESSGREATER],
    [TokenType.Plus, Precedence.SUM],
    [TokenType.Minus, Precedence.SUM],
    [TokenType.SlashF, Precedence.PRODUCT],
    [TokenType.Asterisk, Precedence.PRODUCT],
    [TokenType.LParen, Precedence.CALL],
    [TokenType.LBracket, Precedence.INDEX],
]);
