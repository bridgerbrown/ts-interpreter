import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { Program, IntegerLiteral, Identifier, LetStatement, ExpressionStatement, StringLiteral, ArrayLiteral, InfixExpression, Expression, IndexExpression } from "../ast/ast";
import { TokenType } from "../token/token";

describe("Let statements", () => {
  const input = `let x = 5; let y = 10; let foobar = 838383;`;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  const expected = new Program();
  expected.statements = [
    new LetStatement({ type: TokenType.Let, literal: "let" }, 
      new Identifier({ type: TokenType.Ident, literal: "x" }), 
      new IntegerLiteral({ type: TokenType.Int, literal: "5" }, 5)),
    new LetStatement({ type: TokenType.Let, literal: "let" }, 
      new Identifier({ type: TokenType.Ident, literal: "y" }), 
      new IntegerLiteral({ type: TokenType.Int, literal: "10" }, 10)),
    new LetStatement({ type: TokenType.Let, literal: "let" }, 
      new Identifier({ type: TokenType.Ident, literal: "foobar" }), 
      new IntegerLiteral({ type: TokenType.Int, literal: "838383" }, 838383)),
  ];

  it(`should parse let statements`, () => {
    expect(program.statements.length).toBe(3);
    expect(program.statements[0]).toBeInstanceOf(LetStatement);
    expect(program.statements.length).toBe(expected.statements.length);
  });
});

describe("Identifier expressions", () => {
  const input = "foobar;";

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  parser.checkParserErrors();

  const expected = new Program();
  expected.statements = [
    new ExpressionStatement({ type: TokenType.Ident, literal: "foobar" }, 
      new Identifier({ type: TokenType.Ident, literal: "foobar" })
    )
  ];

  it(`should parse identifier expressions`, () => {
    expect(program.statements.length).toBe(expected.statements.length);
    const actual = program.statements[0] as ExpressionStatement;
    const expectedStatement = expected.statements[0] as ExpressionStatement;
    expect(actual).toBeInstanceOf(ExpressionStatement);
    expect(actual.expression?.tokenLiteral()).toEqual(expectedStatement.expression?.tokenLiteral());
  });
});

describe("Integer literal expression", () => {
  const input = "5;";

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  parser.checkParserErrors();

  const expected = new Program();
  expected.statements = [
    new ExpressionStatement({ type: TokenType.Int, literal: "5" }, 
      new IntegerLiteral({ type: TokenType.Int, literal: "5" }, 5)
    )
  ];

  it(`should parse integer literal expressions`, () => {
    expect(program.statements.length).toBe(expected.statements.length);
    const statement = program.statements[0] as ExpressionStatement;
    const literal = statement.expression; 
    expect(literal).toBeInstanceOf(IntegerLiteral);
    expect(literal?.tokenLiteral()).toBe("5");
  });
});

describe("String literal expression", () => {
  const input = `"hello world";`;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  parser.checkParserErrors();

  const expected = new Program();
  expected.statements = [
    new ExpressionStatement({ type: TokenType.String, literal: `"hello world";` }, 
      new StringLiteral({ type: TokenType.String, literal: `"hello world"` }, "hello world")
    )
  ];

  it(`should parse string literal expressions`, () => {
    expect(program.statements.length).toBe(expected.statements.length);
    const statement = program.statements[0] as ExpressionStatement;
    const literal = statement.expression; 
    expect(literal).toBeInstanceOf(StringLiteral);
    expect(literal?.tokenLiteral()).toBe("hello world");
  });
});

describe("Parsing array literals", () => {
  const input = "[1, 2 * 2, 3 + 3]";

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  parser.checkParserErrors();

  const expected = new Program();
  expected.statements = [
    new ExpressionStatement({ type: TokenType.String, literal: "[1, 2 * 2, 3 + 3]" },
      new ArrayLiteral({ type: TokenType.String, literal: "[1, 2 * 2, 3 + 3]" }, 
        [ 
          new IntegerLiteral({ type: TokenType.Int, literal: "1" }, 1),
          new InfixExpression({ type: TokenType.String, literal: "2 * 2" }, "*", 
            new IntegerLiteral({ type: TokenType.Int, literal: "2" }, 2),
            new IntegerLiteral({ type: TokenType.Int, literal: "2" }, 2),
          ),
          new InfixExpression({ type: TokenType.String, literal: "3 + 3" }, "+", 
            new IntegerLiteral({ type: TokenType.Int, literal: "3" }, 3),
            new IntegerLiteral({ type: TokenType.Int, literal: "3" }, 3),
          )
        ]
      )
    )
  ];

  it(`should parse array literal expressions`, () => {
    const statement = expected.statements[0] as ExpressionStatement;
    const array = statement.expression as ArrayLiteral;
    expect(array).toBeInstanceOf(ArrayLiteral);
    expect(array.elements?.length).toBe(3);

    testIntegerLiteral(array.elements![0], 1);
    testInfixExpression(array.elements![1], 2, "*", 2);
    testInfixExpression(array.elements![2], 3, "+", 3);
  });
});

function testIntegerLiteral(expression: Expression | null, value: number) {
  expect(expression).toBeInstanceOf(IntegerLiteral);
  const integer = expression as IntegerLiteral;
  expect(integer.value).toBe(value);
}

function testInfixExpression(expression: Expression | null, leftValue: number, operator: string, rightValue: number) {
  expect(expression).toBeInstanceOf(InfixExpression);
  const infix = expression as InfixExpression;
  testIntegerLiteral(infix.left, leftValue);
  expect(infix.operator).toBe(operator);
  testIntegerLiteral(infix.right, rightValue);
}

describe("Parsing index expressions", () => {
  const input = "myArray[1 + 1]";

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  parser.checkParserErrors();

  const expected = new Program();
  expected.statements = [
    new ExpressionStatement({ type: TokenType.String, literal: "myArray[1 + 1]" }, 
      new IndexExpression({ type: TokenType.LBracket, literal: "[" }, 
        new Identifier({ type: TokenType.Ident, literal: "myArray" }),
        new InfixExpression({ type: TokenType.Plus, literal: "+" }, "+", 
          new IntegerLiteral({ type: TokenType.Int, literal: "1" }, 1),
          new IntegerLiteral({ type: TokenType.Int, literal: "1" }, 1),
        )
      )
    )
  ];

  it(`should parse index expressions`, () => {
    const statement = program.statements[0] as ExpressionStatement;
    const literal = statement.expression; 
    expect(literal).toBeInstanceOf(IndexExpression);
  });
});

