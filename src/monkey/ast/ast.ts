import { Token } from "../token/token";

interface Node {
  tokenLiteral(): string;
}
export interface Statement extends Node {
  statementNode(): void;
}
export interface LetStatementInterface extends Statement {
  Token: Token;
  Name: Identifier | null;
  Value: Expression | null;
}
export interface Expression extends Node {
  expressionNode(): void;
}

export class Program implements Node {
  public Statements: Statement[];
  
  constructor(statements: Statement[]) {
    this.Statements = statements;
  }

  tokenLiteral(): string {
    if (this.Statements.length > 0) {
      return this.Statements[0].tokenLiteral();
    } else {
      return "";
    }
  }
}

export class LetStatement implements LetStatementInterface {
  public Token: Token;
  public Name: Identifier | null;
  public Value: Expression | null;

  constructor(token: Token, name: Identifier | null, value: Expression | null) {
    this.Token = token;
    this.Name = name;
    this.Value = value;
  }

  statementNode(): void {}
  tokenLiteral(): string {
    return this.Token.literal;
  }
}

export class Identifier implements Expression {
  public Token: Token;
  public Value: string;

  constructor(token: Token, value: string) {
    this.Token = token;
    this.Value = value;
  }

  expressionNode(): void {}
  tokenLiteral(): string {
    return this.Token.literal;
  }
}
