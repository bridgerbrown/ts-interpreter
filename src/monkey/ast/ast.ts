import { Token } from "../token/token";

interface Node {
  tokenLiteral(): string;
}

interface Statement extends Node {
  statementNode(): void;
}

interface Expression extends Node {
  expressionNode(): void;
}

interface Program {
  statements: Statement[];
}

class Program implements Node {
  statements: Statement[] = [];

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }
}

class LetStatement implements Statement {
  token: Token;
  name: Identifier | null;
  value: Expression;

  constructor(token: Token, name: Identifier | null, value: Expression) {
    this.token = token;
    this.name = name;
    this.value = value;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.token.literal;
  }
}

class ReturnStatement implements Statement {
  token: Token;
  returnValue: Expression;

  constructor(token: Token, value: Expression) {
    this.token = token;
    this.returnValue = value;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.token.literal;
  }
}

class Identifier implements Expression {
  token: Token;
  value: string = "";

  constructor(token: Token) {
    this.token = token;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.token.literal;
  }
}

class IntegerLiteral implements Expression {
  token: Token;
  value: number = 0; 

  constructor(token: Token) {
    this.token = token;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.token.literal;
  }
}

export { Statement, Expression, Program, LetStatement, ReturnStatement, Identifier, IntegerLiteral };
