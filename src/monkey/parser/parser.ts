import { Program } from "../ast/ast";
import { Token } from "../token/token";
import { Lexer } from "../lexer/lexer";


class Parser {
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

  parseProgram(): Program | null {
    return null;
  }
}
