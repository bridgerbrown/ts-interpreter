import { Token } from "../token/token";

interface Node {
  tokenLiteral(): string;
}
export interface Statement extends Node {
  statementNode(): void;
}
export interface Expression extends Node {
  expressionNode(): void;
}

export class Program {
  type: "program";
  statements: Statement[];
  
  constructor(statements: Statement[]) {
    this.type = "program";
    this.statements = statements;
  }

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }
}

export class LetStatement implements Statement {
  public token: Token;
  public name: Identifier;
  public value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    this.token = token;
    this.name = name;
    this.value = value;
  }

  statementNode(): void {}
  tokenLiteral(): string {
    return this.token.literal;
  }
}

export class Identifier implements Expression {
  public token: Token;
  public value: string;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  expressionNode(): void {}
  tokenLiteral(): string {
    return this.token.literal;
  }
}
