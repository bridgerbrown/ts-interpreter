import { Lexer } from "../lexer/lexer";
import { Token, TokenType } from "../token/token";
import { Program, Statement, LetStatement, Identifier, Expression, ReturnStatement, ExpressionStatement, IntegerLiteral} from "../ast/ast";

export interface Parser {
  lexer: Lexer;
  currToken: Token;
  peekToken: Token;
  errors: string[];
}

export class Parser implements Parser {
  private prefixParseFns: Map<TokenType, PrefixParseFn> = new Map();
  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.nextToken();
    this.nextToken();
    this.errors = [];
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
    let statement = new ExpressionStatement(this.currToken, this.parseExpression(LOWEST));
    if (this.peekTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }
    return statement;
  }

  parseExpression(): Expression {
    let prefix = this.prefixParseFns.set(this.currToken.type);
    if (prefix === null) return null;
    let leftExp = prefix();
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
