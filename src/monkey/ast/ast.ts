import { Token } from "../token/token";

interface Node {
  tokenLiteral(): string;
}
export interface Statement extends Node {
  statementNode(): void;
}

interface Expression extends Node {
  expressionNode(): void;
}

export class Program implements Node {
  public Statements: Statement[];
  
  constructor(statements: Statement[]) {
    this.Statements = statements;
  }

  public tokenLiteral(): string {
    if (this.Statements.length > 0) {
      return this.Statements[0].tokenLiteral();
    } else {
      return "";
    }
  }
}

export class LetStatement implements Statement {
  public Token: Token;
  public Name: Identifier | null;
  public Value: Expression | null;

  constructor(token: Token, name: Identifier | null, value: Expression | null) {
    this.Token = token;
    this.Name = name;
    this.Value = value;
  }

  public statementNode(): void {}
  public tokenLiteral(): string {
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

  public expressionNode(): void {}
  public tokenLiteral(): string {
    return this.Token.literal;
  }
}
