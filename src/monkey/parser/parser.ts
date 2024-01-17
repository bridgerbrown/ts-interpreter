import { Token, TokenType, TokenItem } from "../token/token";
import { Lexer } from "../lexer/lexer";
import { Program, Statement, LetStatement, Identifier } from "../ast/ast"; 

export class Parser {
  private l: Lexer;
  private currToken: Token;
  private peekToken: Token;

  constructor(l: Lexer) {
    this.l = l;
    this.nextToken();
    this.nextToken();
  }

  public nextToken(): void {
    this.currToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  public parseProgram(): Program {
    const program = new Program([]);

    while (this.currToken.type != TokenType.Eof) {
      const statement = this.parseStatement();
      if (statement !== null) {
        program.Statements.push(statement);
      }
      this.nextToken();
    }

    return program;
  }

  private parseStatement(): Statement | null {
    switch (this.currToken.type) {
      case TokenType.Let:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  public parseLetStatement(): LetStatement | null {
    const statement = new LetStatement(
      this.currToken,
      null,
      null
    );

    if (!this.expectPeek(TokenType.Ident)) return null;

    statement.Name = new Identifier(this.currToken, this.currToken.literal);

    if (!this.expectPeek(TokenType.Assign)) return null;

    while (!this.currTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }
    return statement;
  }

  private currTokenIs(token: TokenItem): boolean {
    return this.currToken.type === token;
  }

  private peekTokenIs(token: TokenItem): boolean {
    return this.peekToken.type === token;
  }

  private expectPeek(token: TokenItem): boolean {
    if (this.peekTokenIs(token)) {
      this.nextToken();
      return true;
    } else {
      return false;
    }
  }
}
