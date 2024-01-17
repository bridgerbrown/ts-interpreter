import { Lexer } from "../../lexer/lexer";
import { Parser } from "../parser";
import { Program, LetStatement, Statement } from "../../ast/ast";

test("TestLetStatements", (test) => {
  const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program: Program = parser.parseProgram();

  if (!program) {
    test.fail("parseProgram() returned null");
  }
  if (program.Statements.length !== 3) {
    test.fail(`program.Statements does not contain 3 statements. got=${program.Statements.length}`);
  }

  const tests = [
    { expectedIdentifier: "x" },
    { expectedIdentifier: "y" },
    { expectedIdentifier: "foobar" }
  ];

  for (let i = 0; i < tests.length; i++) {
    const currTest = tests[i];
    const statement = program.Statements[i];
    if (!testLetStatement(test, statement, currTest.expectedIdentifier)) {
      return;
    }
  }
});

function testLetStatement(test: any, statement: Statement, name: string): boolean {
  if (statement.tokenLiteral() !== "let") {
    test.fail(`statement.tokenLiteral not 'let'. got=${statement.tokenLiteral()}`);
    return false;
  }

  if (!(statement instanceof LetStatement)) {
    test.fail(`statement not LetStatement`);
    return false;
  }

  if (statement.name.value !== name) {
    test.fail(`letStatement.name.value not '${name}'. got=${statement.name.value}`);
    return false;
  }
  if (statement.name.tokenLiteral() !== name) {
    test.fail(`letStatement.name.tokenLiteral() not '${name}'. got=${statement.name.tokenLiteral()}`);
    return false;
  }
  return true;
}
