import { Token } from "../token/token";

interface Node {
  tokenLiteral(): string;
  string(): string;
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
  string(): string {
    let out: string = "";
    for (const s of this.statements) {
      out += s.string();
    }
    return out;
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
  string(): string {
    let out: string = "";
    out += this.tokenLiteral() + " ";
    out += this.name ? this.name.toString() : "";
    out += " = ";
    if (this.value !== null) {
      out += this.value.toString();
    }
    out += ";";
    return out;
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
  string(): string {
    let out: string = "";
    out += this.tokenLiteral() + " ";
    if (this.returnValue !== null) {
      out += this.returnValue.toString();
    }
    out += ";";
    return out;
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
  string(): string {
    return this.value;
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
  string(): string {
    return this.value.toString();
  }
}

class ExpressionStatement implements Statement {
  token: Token;
  expression: Expression;

  constructor(token: Token, expression: Expression) {
    this.token = token;
    this.expression = expression;
  }

  statementNode(): void {}
  tokenLiteral(): string {
      return this.token.literal;
  }
  string(): string {
    if (this.expression !== null) {
      return `${this.expression.toString()}`;
    }
    return "";
  }
}

export { Statement, Expression, Program, LetStatement, ReturnStatement, Identifier, IntegerLiteral,
ExpressionStatement
};
