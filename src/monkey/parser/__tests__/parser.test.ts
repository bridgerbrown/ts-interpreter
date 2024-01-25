import { Lexer } from "../../lexer/lexer";
import { Parser } from "../parser";
import { Program, IntegerLiteral, Identifier, Statement, LetStatement, ExpressionStatement } from "../../ast/ast";
import { TokenType } from "../../token/token";

test("Let statements", () => {
  const input = `let x = 5; let y = 10; let foobar = 838383;`;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  const expected = new Program();
  expected.statements = [
    new LetStatement({ type: TokenType.Let, literal: "let" }, 
      new Identifier({ type: TokenType.Ident, literal: "x" }), 
      new IntegerLiteral({ type: TokenType.Int, literal: "5" })),
    new LetStatement({ type: TokenType.Let, literal: "let" }, 
      new Identifier({ type: TokenType.Ident, literal: "y" }), 
      new IntegerLiteral({ type: TokenType.Int, literal: "10" })),
    new LetStatement({ type: TokenType.Let, literal: "let" }, 
      new Identifier({ type: TokenType.Ident, literal: "foobar" }), 
      new IntegerLiteral({ type: TokenType.Int, literal: "838383" })),
  ];

  expect(program.statements.length).toBe(3);
  expect(program.statements[0]).toBeInstanceOf(LetStatement);
  expect(program.statements.length).toBe(expected.statements.length);
});

test("Identifier expressions", () => {
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

  expect(program.statements.length).toBe(expected.statements.length);
  const actual = program.statements[0] as ExpressionStatement;
  const expectedStatement = expected.statements[0] as ExpressionStatement;
  expect(actual).toBeInstanceOf(ExpressionStatement);
  expect(actual.expression?.tokenLiteral()).toEqual(expectedStatement.expression?.tokenLiteral());
});

test("Integer literaal expression", () => {
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
  expect(program.statements.length).toBe(expected.statements.length);
  const statement = program.statements[0] as ExpressionStatement;
  const literal = statement.expression; 
  expect(literal).toBeInstanceOf(IntegerLiteral);
  expect(literal).toBe(5);
});
