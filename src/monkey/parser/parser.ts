import { Lexer } from "../lexer/lexer";
import { Token, TokenType, TokenItem } from "../token/token";
import { Program, Statement, LetStatement, Identifier, Expression} from "../ast/ast";

export class Parser {
  private l: Lexer;
  private currToken: Token;
  private peekToken: Token;

  constructor(l: Lexer) {
    this.l = l;
    const firstToken = l.nextToken();
    if (!firstToken) throw new Error("No first token.");
    this.currToken = firstToken;
    this.peekToken = l.nextToken();
  }

  nextToken(): void {
    this.currToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  currTokenIs(token: TokenItem): boolean {
    return this.currToken.type == token;
  }

  peekTokenIs(token: TokenItem): boolean {
    return this.peekToken.type == token;
  }

  expectPeek(token: TokenItem): boolean {
    if (this.peekTokenIs(token)) {
      this.nextToken();
      return true;
    } else {
      return false;
    }
  }

  parseProgram(): Program {
    const program: Program = new Program([]);

    while (this.currToken.type !== TokenType.Eof) {
      const statement: Statement | null = this.parseStatement();
      if (statement !== null) {
        program.statements.push(statement);
      }
      this.nextToken();
    }

    return program;
  }

  parseStatement(): Statement | null {
    switch (this.currToken.type) {
      case TokenType.Let:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  parseLetStatement(): LetStatement | null {
    const statement: LetStatement = new LetStatement(this.currToken, {} as Identifier, {} as Expression);
    if (!this.expectPeek(TokenType.Ident)) return null;
    statement.name = new Identifier(this.currToken, this.currToken.literal);
    if (!this.expectPeek(TokenType.Assign)) return null;

    while (!this.currTokenIs(TokenType.Semicolon)) {
      this.nextToken();
    }
    return statement;
  }
}

