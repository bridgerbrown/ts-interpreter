import { Lexer } from "../lexer/lexer";
import { Token, TokenType } from "../token/token";
import { LetStatementInterface, Program, Statement, LetStatement, Identifier, Expression} from "../ast/ast";

export class Parser {
  private l: Lexer;
  private currToken: Token;
  private peekToken: Token;

  constructor(l: Lexer) {
    this.l = l;
    this.nextToken();
    this.nextToken();
  }

  private nextToken(): void {
    this.currToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  public parseProgram(): Program {
    const program: Program = new Program([]);
    program.Statements = [];

    while (this.currToken.type !== TokenType.Eof) {
      const statement: Statement | null = this.parseStatement();
      if (statement !== null) {
        program.Statements.push(statement);
      }
      this.nextToken();
    }

    return program;
  }

  public parseStatement(): Statement | null {
    switch (this.currToken.type) {
      case TokenType.Let:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  createLetStatement(token: Token, name: Identifier | null, value: Expression | null): LetStatementInterface {
    return new LetStatement(token, name, value);
  }

  private parseLetStatement(): LetStatementInterface | null {
    const statement: LetStatementInterface = this.createLetStatement(this.currToken, null, null);

    if (!this.expectPeek(TokenType.Ident)) return null;

    statement.Name = new Identifier(this.currToken, this.currToken.literal);

    if (!this.expectPeek(TokenType.Assign)) return null;

    // TODO: We're skipping the expressions until we encounter a semicolon
    while (!this.currTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }
    return statement;
  }
}
