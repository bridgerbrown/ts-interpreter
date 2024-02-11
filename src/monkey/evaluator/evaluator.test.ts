import { Lexer } from "../lexer/lexer";
import { IntegerVal } from "../object/object";
import { Parser } from "../parser/parser";
import { evaluate } from "./evaluator";

function testEval(input: string) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  return evaluate(program);
}

describe("Evaluate integer expression", () => {
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

function testIntegerObject(obj: any, expected: number) {
  expect(obj.value).toBe(expected);
}

describe("Evaluate boolean expression", () => {
  const tests = [
    { input: 'true', expected: true },
    { input: 'false', expected: false },
  ];

  tests.forEach((test) => {
    it(`should evaluate ${test.input} to ${test.expected}`, () => {
      const evaluated = testEval(test.input); 
      expect(evaluated).toBeInstanceOf(IntegerVal);
      testBooleanObject(evaluated, test.expected);
    });
  });
});

function testBooleanObject(obj: any, expected: boolean) {
  expect(obj.value).toBe(expected);
}
