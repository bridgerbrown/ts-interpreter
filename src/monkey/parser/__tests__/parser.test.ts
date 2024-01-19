import { Lexer } from "../../lexer/lexer";
import { Parser } from "../parser";
import { Program, Statement, LetStatement } from "../../ast/ast";

test("TestLetStatements", () => {
  const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program: Program = parser.parseProgram();

  expect(program).not.toBeNull();
  expect(program?.statements.length).toBe(3);

  const tests = [
    { expectedIdentifier: "x" },
    { expectedIdentifier: "y" },
    { expectedIdentifier: "foobar" }
  ];

  for (let i = 0; i < tests.length; i++) {
    const currTest = tests[i];
    const statement = program?.statements[i];

    expect(statement?.tokenLiteral()).toBe("let");

    if (statement instanceof LetStatement) {
      expect(statement.name?.value).toBe(currTest.expectedIdentifier);
      expect(statement.name?.tokenLiteral()).toBe(currTest.expectedIdentifier);
    } else {
      fail("statement not LetStatement");
    }
  }
});
