import { Lexer } from "../lexer/lexer";
import { IntegerVal } from "../object/object";
import { Parser } from "../parser/parser";

describe("Eval integer expression", () => {
  const tests = [
    { input: '5', expected: 5 },
    { input: '10', expected: 10 },
  ];

  tests.forEach((test) => {
    it(`should evaluate ${test.input} to ${test.expected}`, () => {
      const evaluated = testEval(test.input); 
      expect(evaluated).toBeInstanceOf(IntegerVal);
      testIntegerObject(evaluated, test.expected);
    });
  });
});

function testEval(input: string) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  return Eval(program);
}

function testIntegerObject(obj: Integer, expected: number) {
  expect(obj.value).toBe(expected);
}
