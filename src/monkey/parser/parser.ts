import { Lexer } from "../lexer/lexer";
import { Token, TokenType } from "../token/token";
import { Program, Statement, LetStatement, Identifier, Expression, ReturnStatement, ExpressionStatement, IntegerLiteral, PrefixExpression, InfixExpression, Boolean, IfExpression, BlockStatement} from "../ast/ast";

export interface Parser {
  lexer: Lexer;
  currToken: Token;
  peekToken: Token;
  errors: string[];
}

export class Parser implements Parser {
  private prefixParseFns: Map<TokenType, PrefixParseFn> = new Map();
  private infixParseFns: Map<TokenType, InfixParseFn> = new Map();
  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];

    this.prefixParseFns= new Map<TokenType, PrefixParseFn>;
    this.registerPrefix(TokenType.Ident, this.parseIdentifier);
    this.registerPrefix(TokenType.Int, this.parseIntegerLiteral);
    this.registerPrefix(TokenType.Excl, this.parsePrefixExpression);
    this.registerPrefix(TokenType.Minus, this.parsePrefixExpression);
    this.registerPrefix(TokenType.True, this.parseBoolean);
    this.registerPrefix(TokenType.False, this.parseBoolean);
    this.registerPrefix(TokenType.If, this.parseIfExpression);

    this.infixParseFns = new Map<TokenType, InfixParseFn>;
    this.registerInfix(TokenType.Plus, this.parseInfixExpression);
    this.registerInfix(TokenType.Minus, this.parseInfixExpression);
    this.registerInfix(TokenType.SlashF, this.parseInfixExpression);
    this.registerInfix(TokenType.Asterisk, this.parseInfixExpression);
    this.registerInfix(TokenType.Equal, this.parseInfixExpression);
    this.registerInfix(TokenType.NotEqual, this.parseInfixExpression);
    this.registerInfix(TokenType.Lt, this.parseInfixExpression);
    this.registerInfix(TokenType.Gt, this.parseInfixExpression);

    this.nextToken();
    this.nextToken();
  }

  nextToken(): void {
    this.currToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  currTokenIs(token: TokenType): boolean {
    return this.currToken.type == token;
  }

  peekTokenIs(token: TokenType): boolean {
    return this.peekToken.type == token;
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

  parseProgram(): Program {
    const program = new Program();
    program.statements = [];
    
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
    const statement: LetStatement = new LetStatement(this.currToken, null, null);

    if (!this.expectPeek(TokenType.Ident)) return null;

    statement.name = new Identifier(this.currToken);

    if (!this.expectPeek(TokenType.Assign)) return null;
    
    this.nextToken();

    while (this.peekTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }
    return statement;
  }

  parseReturnStatement(): ReturnStatement | null {
    const statement: ReturnStatement = new ReturnStatement(this.currToken, null);
    this.nextToken();

    while (!this.currTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }
    return statement; 
}

  
  parseIdentifier(): Expression {
    return new Identifier(this.currToken);
  }

  parseExpressionStatement(): ExpressionStatement {
    let statement = new ExpressionStatement(this.currToken, this.parseExpression(Precedence.LOWEST));
    if (this.peekTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }
    return statement;
  }

  noPrefixParseFnError(token: TokenType) {
    let msg = `No prefix parse function for ${token} found.`
    this.errors.push(msg);
  }

  parseExpression(precedence: Precedence): Expression | null {
    const prefix: any = this.prefixParseFns.get(this.currToken.type);
    if (prefix === null) {
      this.noPrefixParseFnError(this.currToken.type);
      return null;
    } 
    let leftExp = prefix()!;

    while (!this.peekTokenIs(TokenType.Semicolon) && precedence < this.peekPrecedence()) {
      const infix: any = this.infixParseFns.get(this.peekToken.type);
      if (infix === null) return leftExp;
      this.nextToken();
      leftExp = infix(leftExp)!;
    }
    return leftExp;
  }

  parseIntegerLiteral(): Expression {
    const literal = new IntegerLiteral(this.currToken);
    let value: number = parseInt(this.currToken.literal, 10);
    if (isNaN(value)) {
      let message = `Could not parse ${this.currToken.literal} as integer.`;
      this.errors.push(message);
    }
    literal.value = value;
    return literal;
  }

  parsePrefixExpression(): Expression {
    let expression = new PrefixExpression(this.currToken, this.currToken.literal, null);
    this.nextToken();
    expression.right = this.parseExpression(Precedence.PREFIX);
    return expression;
  }

  checkParserErrors(): string[] {
    return this.errors;
  }

  peekError(token: TokenType): void {
    let message = `Expected next token to be ${token}, instead got ${this.peekToken.type}`;
    this.errors.push(message);
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

  parseInfixExpression(left: Expression): Expression {
    const precedence = this.currPrecedence();
    const right = this.parseExpression(precedence);
    const expression = new InfixExpression(this.currToken, this.currToken.literal, left, right);
    this.nextToken();
    return expression;
  }

  parseBoolean(): Expression {
    const expression = new Boolean(this.currToken, this.currTokenIs(TokenType.True))
    return expression;
  }

  parseIfExpression(): Expression | null {
    let expression = new IfExpression(this.currToken, null, null, null);

    if (!this.expectPeek(TokenType.LParen)) return null;
    this.nextToken();
    expression.condition = this.parseExpression(Precedence.LOWEST);
    if (!this.expectPeek(TokenType.RParen)) return null;
    if (!this.expectPeek(TokenType.LBrace)) return null;
    expression.consequence = this.parseBlockStatement();

    if (this.peekTokenIs(TokenType.Else)) {
      this.nextToken();
      if (!this.expectPeek(TokenType.LBrace)) return null;
      expression.alternative = this.parseBlockStatement();
    }

    return expression;
  }

  parseBlockStatement(): BlockStatement {
    let block = new BlockStatement(this.currToken, []);
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
}

interface PrefixParseFn {
  (): Expression;
}

interface InfixParseFn {
  (expression: Expression): Expression;
}

enum Precedence {
  _,
  LOWEST,
  EQUALS,
  LESSGREATER,
  SUM,
  PRODUCT,
  PREFIX,
  CALL
}

const precedences = new Map<TokenType, Precedence>([
  [TokenType.Equal, Precedence.EQUALS],
  [TokenType.NotEqual, Precedence.EQUALS],
  [TokenType.Lt, Precedence.LESSGREATER],
  [TokenType.Gt, Precedence.LESSGREATER],
  [TokenType.Plus, Precedence.SUM],
  [TokenType.Minus, Precedence.SUM],
  [TokenType.SlashF, Precedence.PRODUCT],
  [TokenType.Asterisk, Precedence.PRODUCT]
])
