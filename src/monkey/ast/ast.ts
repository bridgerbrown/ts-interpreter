import { Token } from "../lexer/lexer";

interface Node {
  TokenLiteral(): string;
}

interface Statement extends Node {
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

  TokenLiteral(): string {
    if (this.Statements.length > 0) {
      return this.Statements[0].TokenLiteral();
    } else {
      return "";
    }
  }
}

class LetStatement implements Statement {
  public Token: Token;
  public Name: Identifier;
  public Value: Expression;

  constructor(token: Token, name: Identifier, value: Expression) {
    this.Token = token;
    this.Name = name;
    this.Value = value;
  }
}

class Identifier implements Expression {
  public Token: Token;
  public Value: string;

  constructor(token: Token, value: string) {
    this.Token = token;
    this.Value = value;
  }

  expressionNode(): void {}
  TokenLiteral(): string {
    return this.Token.literal;
  }
}
