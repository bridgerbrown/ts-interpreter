import { Lexer } from "../lexer/lexer";
import { Token, TokenType } from "../token/token";
import { Program, Statement, LetStatement, Identifier, Expression, ReturnStatement, ExpressionStatement, IntegerLiteral, PrefixExpression, InfixExpression, Boolean, IfExpression, BlockStatement, FunctionLiteral, CallExpression, StringLiteral} from "../ast/ast";

export interface Parser {
  lexer: Lexer;
  currToken: Token;
  peekToken: Token;
  errors: string[];
}

export class Parser implements Parser {
  private prefixParseFns = new Map<TokenType, PrefixParseFn>([
    [TokenType.Ident, this.parseIdentifier.bind(this)],
    [TokenType.Int, this.parseIntegerLiteral.bind(this)],
    [TokenType.Excl, this.parsePrefixExpression.bind(this)],
    [TokenType.Minus, this.parsePrefixExpression.bind(this)],
    [TokenType.True, this.parseBoolean.bind(this)],
    [TokenType.False, this.parseBoolean.bind(this)],
    [TokenType.If, this.parseIfExpression.bind(this)],
    [TokenType.Function, this.parseFunctionLiteral.bind(this)],
    [TokenType.LParen, this.parseGroupedExpression.bind(this)],
    [TokenType.String, this.parseStringLiteral.bind(this)]
  ]);

  private infixParseFns = new Map<TokenType, InfixParseFn>([
    [TokenType.Plus, this.parseInfixExpression.bind(this)],
    [TokenType.Minus, this.parseInfixExpression.bind(this)],
    [TokenType.SlashF, this.parseInfixExpression.bind(this)],
    [TokenType.Asterisk, this.parseInfixExpression.bind(this)],
    [TokenType.Equal, this.parseInfixExpression.bind(this)],
    [TokenType.NotEqual, this.parseInfixExpression.bind(this)],
    [TokenType.Lt, this.parseInfixExpression.bind(this)],
    [TokenType.Gt, this.parseInfixExpression.bind(this)],
    [TokenType.LParen, this.parseCallExpression.bind(this)]
  ]);

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];

    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.currToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  currTokenIs(token: TokenType): boolean {
    return this.currToken.type === token;
  }

  peekTokenIs(token: TokenType): boolean {
    return this.peekToken.type === token;
  }

  expectPeek(token: TokenType): boolean {
    if (this.peekTokenIs(token)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(token);
      return false;
    }
  }

  peekError(token: TokenType): void {
    const message = `Expected next token to be ${token}, instead got ${this.peekToken.type}`;
    this.errors.push(message);
  }

  parseProgram(): Program {
    const program = new Program();
    
    while (!this.currTokenIs(TokenType.Eof)) {
      let statement = this.parseStatement();
      if (statement !== null) {
        program.statements.push(statement);
      }
      this.nextToken()
    }
    return program;
  }

  parseStatement(): Statement | null {
    switch (this.currToken.type) {
      case (TokenType.Let):
        return this.parseLetStatement();
      case (TokenType.Return):
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement(): LetStatement | null {
    if (!this.expectPeek(TokenType.Ident)) return null;

    const name = new Identifier(this.currToken);

    if (!this.expectPeek(TokenType.Assign)) return null;
    
    this.nextToken();

    const value = this.parseExpression(Precedence.LOWEST);

    if (!this.currTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }

    return new LetStatement(this.currToken, name, value);
  }

  parseReturnStatement(): ReturnStatement | null {
    this.nextToken();
    
    const returnValue = this.parseExpression(Precedence.LOWEST);

    while (!this.currTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }

    return new ReturnStatement(this.currToken, returnValue);
}

  
  parseIdentifier(): Expression {
    return new Identifier(this.currToken);
  }

  parseExpressionStatement(): ExpressionStatement {
    const statement = new ExpressionStatement(this.currToken, this.parseExpression(Precedence.LOWEST));
    if (this.peekTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }
    return statement;
  }

  noPrefixParseFnError(token: TokenType) {
    const msg = `No prefix parse function for ${token} found.`
    this.errors.push(msg);
  }

  parseExpression(precedence: Precedence): Expression | null {
    const prefix: any = this.prefixParseFns.get(this.currToken.type)!;
    if (!prefix) {
      this.noPrefixParseFnError(this.currToken.type);
      return null;
    } 
    let leftExp = prefix();

    if (prefix) {
      // console.log(`Parsed Prefix Expression: ${leftExp.string()}`);
    }

    while (!this.peekTokenIs(TokenType.Semicolon) && precedence < this.peekPrecedence()) {
      const infix = this.infixParseFns.get(this.peekToken.type)!;
      if (!infix) {
        console.log("No infix");
        return leftExp;
      };
      this.nextToken();
      leftExp = infix(leftExp);
      // console.log(`Parsed Infix Expression: ${leftExp.string()}`);
    }
    return leftExp;
  }

  parseIntegerLiteral(): Expression {
    const value: number = parseInt(this.currToken.literal, 10);
    if (isNaN(value)) {
      let message = `Could not parse ${this.currToken.literal} as integer.`;
      this.errors.push(message);
    }
    return new IntegerLiteral(this.currToken, value);
  }

  checkParserErrors(): string[] {
    return this.errors;
  }

  registerPrefix(tokenType: TokenType, fn: PrefixParseFn): void {
    this.prefixParseFns.set(tokenType, fn);
  }

  registerInfix (tokenType: TokenType, fn: InfixParseFn): void {
    this.infixParseFns.set(tokenType, fn);
  }
  
  peekPrecedence(): number {
    const precedence = precedences.get(this.peekToken.type);
    if (precedence !== undefined) return precedence;
    return Precedence.LOWEST;
  }

  currPrecedence(): number {
    const precedence = precedences.get(this.currToken.type);
    if (precedence !== undefined) return precedence;
    return Precedence.LOWEST;
  }

  parsePrefixExpression(): Expression {
    const expression = new PrefixExpression(this.currToken, this.currToken.literal, null);
    this.nextToken();
    expression.right = this.parseExpression(Precedence.PREFIX);
    return expression;
  }

  parseInfixExpression(left: Expression): Expression {
    const operator = this.currToken.literal;
    const precedence = this.currPrecedence();
    this.nextToken();
    const right = this.parseExpression(precedence);
    return new InfixExpression(this.currToken, operator, left, right);
  }

  parseBoolean(): Expression {
    const expression = new Boolean(this.currToken, this.currTokenIs(TokenType.True))
    return expression;
  }

  parseIfExpression(): Expression | null {
    if (!this.expectPeek(TokenType.LParen)) return null;
    this.nextToken();
    const condition = this.parseExpression(Precedence.LOWEST);
    if (!this.expectPeek(TokenType.RParen)) return null;
    if (!this.expectPeek(TokenType.LBrace)) return null;
    const consequence = this.parseBlockStatement();

    let alternative;
    if (this.peekTokenIs(TokenType.Else)) {
      this.nextToken();
      if (!this.expectPeek(TokenType.LBrace)) return null;
      alternative = this.parseBlockStatement();
    }

    return new IfExpression(this.currToken, condition, consequence, alternative);
  }

  parseBlockStatement(): BlockStatement {
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

  parseFunctionLiteral(): Expression | null {
    if (!this.expectPeek(TokenType.LParen)) return null;
    const parameters = this.parseFunctionParameters();
    if (!this.expectPeek(TokenType.LBrace)) return null;
    const body = this.parseBlockStatement();
    return new FunctionLiteral(this.currToken, parameters, body);
  }

  parseFunctionParameters(): Identifier[] | null {
    const identifiers: Identifier[] = [];

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

    if (!this.expectPeek(TokenType.RParen)) return null;
    return identifiers;
  }

  parseCallExpression(fn: Expression): Expression {
    return new CallExpression(this.currToken, fn, this.parseCallArguments());
  }

  parseCallArguments(): (Expression | null)[] | null {
    const args: (Expression | null)[] = [];
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
    
    if (!this.expectPeek(TokenType.RParen)) return null;
    return args;
  }

  parseGroupedExpression(): Expression | null {
    this.nextToken();
    let exp = this.parseExpression(Precedence.LOWEST);
    if (!this.expectPeek(TokenType.RParen)) return null;
    return exp;
  }

  parseStringLiteral(): Expression | null {
    return new StringLiteral(this.currToken, this.currToken.literal);
  }
}

interface PrefixParseFn {
  (): Expression | null;
}

interface InfixParseFn {
  (expression: Expression): Expression;
}

enum Precedence {
  LOWEST = 0,
  EQUALS = 1,
  LESSGREATER = 2,
  SUM = 3,
  PRODUCT = 4,
  PREFIX = 5,
  CALL = 6
}

const precedences = new Map<TokenType, Precedence>([
  [TokenType.Equal, Precedence.EQUALS],
  [TokenType.NotEqual, Precedence.EQUALS],
  [TokenType.Lt, Precedence.LESSGREATER],
  [TokenType.Gt, Precedence.LESSGREATER],
  [TokenType.Plus, Precedence.SUM],
  [TokenType.Minus, Precedence.SUM],
  [TokenType.SlashF, Precedence.PRODUCT],
  [TokenType.Asterisk, Precedence.PRODUCT],
  [TokenType.LParen, Precedence.CALL],
])
