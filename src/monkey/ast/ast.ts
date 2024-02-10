import { Token, TokenType } from "../token/token";

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

  constructor() {
    this.statements = [];
  }

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
  value: Expression | null;

  constructor(token: Token, name: Identifier | null, value: Expression | null) {
    this.token = token;
    this.name = name;
    this.value = value;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.token.literal;
  }
  string(): string {
    let out: string = `let ${this.name?.value} = ${this.value?.string()};`
    return out;
  }
}

class ReturnStatement implements Statement {
  token: Token;
  returnValue: Expression | null;

  constructor(token: Token, value: Expression | null) {
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
    this.value = token.literal;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.token.literal;
  }
  string(): string {
    return this.value.toString();
  }
}

class IntegerLiteral implements Expression {
  token: Token;
  value: number; 

  constructor(token: Token, value: number) {
    this.token = token;
    this.value = value;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.token.literal;
  }
  string(): string {
    if (this.value) {
      return this.value.toString();
    } else {
      return "";
    }
  }
}

class ExpressionStatement implements Statement {
  token: Token;
  expression: Expression | null;

  constructor(token: Token, expression: Expression | null) {
    this.token = token;
    this.expression = expression;
  }

  statementNode(): void {}
  tokenLiteral(): string {
      return this.token.literal;
  }
  string(): string {
    if (this.expression !== null) {
      return `${this.expression.tokenLiteral()}`;
    }
    return "";
  }
}

class PrefixExpression implements Expression {
  token: Token;
  operator: string;
  right: Expression | null;

  constructor(token: Token, operator: string, right: Expression | null) {
    this.token = token;
    this.operator = operator;
    this.right = right;
  }

  expressionNode(): void {
      
  }
  tokenLiteral(): string {
      return this.token.literal;
  }
  string(): string {
    return "(" + this.operator + this.right?.toString() + ")";
  }
}

class InfixExpression implements Expression {
  token: Token;
  operator: string;
  left: Expression;
  right: Expression | null;

  constructor(token: Token, operator: string, left: Expression, right: Expression | null) {
    this.token = token;
    this.operator = operator;
    this.left = left;
    this.right = right;
  }

  expressionNode(): void {
      
  }
  tokenLiteral(): string {
      return this.token.literal;
  }
  string(): string {
    return `(${this.left.string()} ${this.operator.toString()} ${this.right?.string()}) `
  }
}

class Boolean implements Expression {
  token: Token;
  value: boolean;

  constructor(token: Token, value: boolean) {
    this.token = token;
    this.value = value;
  }

  expressionNode(): void {
      
  }
  tokenLiteral(): string {
      return this.token.literal;
  }
  string(): string {
    return this.token.literal;
  }
}

class IfExpression implements Expression {
  token: Token;
  condition: Expression | null;
  consequence: BlockStatement;
  alternative: BlockStatement | undefined;

  constructor(token: Token, condition: Expression | null, 
    consequence: BlockStatement, alternative: BlockStatement | undefined) {
    this.token = token;
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  expressionNode(): void {
      
  }
  tokenLiteral(): string {
      return this.token.literal;
  }
  string(): string {
    let expression: string = "if" + this.condition?.string() + " " + this.consequence?.string();
    if (this.alternative !== null) {
      expression += "else " + this.alternative?.string();
    }
    return expression;
  }
}

class BlockStatement implements Statement {
  token: Token;
  statements: Statement[];

  constructor(token: Token, statements: Statement[]) {
    this.token = token;
    this.statements = statements; 
  }

  statementNode(): void {
      
  }
  tokenLiteral(): string {
      return this.token.literal;
  }
  string(): string {
    let statements = "";
    for (let s of this.statements) {
      statements += s.string();
    }
    return statements;
  }
}

class FunctionLiteral implements Expression {
  token: Token;
  parameters: Identifier[] | null;
  body: BlockStatement | null;

  constructor(token: Token, parameters: Identifier[] | null, body: BlockStatement | null) {
    this.token = token;
    this.parameters = parameters;
    this.body = body;
  }

  expressionNode(): void {
      
  }
  tokenLiteral(): string {
      return this.token.literal;
  }
  string(): string {
    let params = [];
    if (this.parameters) {
      for (const p of this.parameters) {
        params.push(p.string());
      }
    }
    let body = "";
    if (this.body) {
      body = this.body.toString();
    }
    let str = this.tokenLiteral() + "(" + params.join(", ") + ") " + body;
    return str;
  }
}

class CallExpression implements Expression {
  token: Token;
  fn: Expression;
  args: (Expression | null)[] | null;

  constructor(token: Token, fn: Expression, args: (Expression | null)[] | null) {
    this.token = token;
    this.fn= fn;
    this.args = args;
  }

  expressionNode(): void {
      
  }
  tokenLiteral(): string {
    return this.token.literal;
  }
  string(): string {
    let args = [];
    if (this.args) {
      for (let arg of this.args) {
        args.push(arg?.string());
      }
      return this.fn.string() + "(" + this.args.join(", ") + ")";
    }
    return "";
  }
}


export { Statement, Expression, Program, LetStatement, ReturnStatement, Identifier, IntegerLiteral,
ExpressionStatement, PrefixExpression, InfixExpression, Boolean, IfExpression, BlockStatement, FunctionLiteral,
CallExpression
};

