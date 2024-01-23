import { Lexer } from "../lexer/lexer";
import { Token, TokenType } from "../token/token";
import { Program, Statement, LetStatement, Identifier, Expression, ReturnStatement} from "../ast/ast";

export interface Parser {
  lexer: Lexer;
  currToken: Token;
  peekToken: Token;
  errors: string[];
}

export class Parser implements Parser {
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
        return null;
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

  parseIdentifier() {
    const identifier = newIdentifierASTNode();
    identifier.token = this.currToken();
    return identifier;
  }

  parseExpression() {
    if (this.currToken() == TokenType.Int) {
      if (this.nextToken() == TokenType.Plus) {
        return parseOperatorExpression();
      } else if (this.nextToken() == TokenType.Semicolon) {
        return parseIntegerValue();
      }
    } else if (this.currToken() == TokenType.LParen) {
      return parseGroupedExpression();
    }
  }

  parseOperatorExpression() {
    const operatorExpression = newOperatorExpression();
    operatorExpression.left = parseIntegerLiteral();
    this.advanceTokens();
    operatorExpression.operatorExpression = this.currToken();
    this.advanceTokens();
    operatorExpression.right = this.parseExpression();
    return operatorExpression;
  }

  checkErrors(): string[] {
    return this.errors;
  }

  peekError(token: TokenType): void {
    let message = `Expected next token to be ${token}, instead got ${this.peekToken.type}`;
    this.errors.push(message);
  }
}


