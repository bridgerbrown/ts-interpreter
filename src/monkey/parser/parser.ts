import { Lexer } from "../lexer/lexer";
import { Token, TokenType } from "../token/token";
import { Program, Statement, LetStatement, Identifier, Expression} from "../ast/ast";

export interface Parser {
  lexer: Lexer;
  currToken: Token;
  peekToken: Token;
}

export class Parser implements Parser {
  constructor(lexer: Lexer) {
    this.lexer = lexer;
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
      return false;
    }
  }

  parseProgram(): Program {
    const program = new Program();
    program.statements = [];
    
    while (this.currToken.type !== TokenType.Eof) {
      const statement = this.parseStatement();
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
}


