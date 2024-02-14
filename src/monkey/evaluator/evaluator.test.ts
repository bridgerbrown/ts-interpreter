import { Lexer } from "../lexer/lexer";
import { BooleanVal, ErrorVal, FunctionVal, IntegerVal, Objects, StringVal } from "../object/object";
import { Environment } from "../object/environment";
import { Parser } from "../parser/parser";
import { evaluate } from "./evaluator";

function testEval(input: string) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  const env = new Environment();
  return evaluate(program, env);
}

describe("Evaluate integer expression", () => {
  const tests = [
    { input: '5', expected: 5 },
    { input: '10', expected: 10 },
    { input: '-5', expected: -5 },
    { input: '-10', expected: -10 },
    { input: "5", expected: 5 },
    { input: "10", expected: 10 },
    { input: "-5", expected: -5 },
    { input: "-10", expected: -10 },
    { input: "5 + 5 + 5 + 5 - 10", expected: 10 },
    { input: "2 * 2 * 2 * 2 * 2", expected: 32 },
    { input: "-50 + 100 + -50", expected: 0 },
    { input: "5 * 2 + 10", expected: 20 },
    { input: "5 + 2 * 10", expected: 25 },
    { input: "20 + 2 * -10", expected: 0 },
    { input: "50 / 2 * 2 + 10", expected: 60 },
    { input: "2 * (5 + 10)", expected: 30 },
    { input: "3 * 3 * 3 + 10", expected: 37 },
    { input: "3 * (3 * 3) + 10", expected: 37 },
    { input: "(5 + 10 * 2 + 15 / 3) * 2 + -10", expected: 50 },
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
    { input: "1 < 2", expected: true },
    { input: "1 > 2", expected: false },
    { input: "1 < 1", expected: false },
    { input: "1 > 1", expected: false },
    { input: "1 == 1", expected: true },
    { input: "1 != 1", expected: false },
    { input: "1 == 2", expected: false },
    { input: "1 != 2", expected: true },
    { input: "true == true", expected: true },
    { input: "false == false", expected: true },
    { input: "true == false", expected: false },
    { input: "true != false", expected: true },
    { input: "false != true", expected: true },
    { input: "(1 < 2) == true", expected: true },
    { input: "(1 < 2) == false", expected: false },
    { input: "(1 > 2) == true", expected: false },
    { input: "(1 > 2) == false", expected: true },
  ];

  tests.forEach((test) => {
    it(`should evaluate ${test.input} to ${test.expected}`, () => {
      const evaluated = testEval(test.input); 
      expect(evaluated).toBeInstanceOf(BooleanVal);
      testBooleanObject(evaluated, test.expected);
    });
  });
});

function testBooleanObject(obj: any, expected: boolean) {
  expect(obj.value).toBe(expected);
}

describe("Evaluate exclamation operator", () => {
  const tests = [
    { input: '!true', expected: false },
    { input: '!false', expected: true },
    { input: '!5', expected: false },
    { input: '!!5', expected: true },
    { input: '!!true', expected: true },
    { input: '!!false', expected: false },
  ];

  tests.forEach((test) => {
    it(`should evaluate ${test.input} to ${test.expected}`, () => {
      const evaluated = testEval(test.input); 
      expect(evaluated).toBeInstanceOf(BooleanVal);
      testBooleanObject(evaluated, test.expected);
    });
  });
});

describe("Evaluate if else expressions", () => {
  const tests = [
    { input: "if (true) { 10 }", expected: 10 },
    { input: "if (false) { 10 }", expected: null },
    { input: "if (1) { 10 }", expected: 10 },
    { input: "if (1 < 2) { 10 }", expected: 10 },
    { input: "if (1 > 2) { 10 }", expected: null },
    { input: "if (1 > 2) { 10 } else { 20 }", expected: 20 },
    { input: "if (1 < 2) { 10 } else { 20 }", expected: 10 },
  ];

  for (const { input, expected } of tests) {
    it(`should evaluate ${input} to ${expected}`, () => {
      const evaluated = testEval(input); 
      if (typeof expected === 'number') {
        expect(evaluated).toEqual({ "value": expected });
      } else {
        testNullObject(evaluated);
      }
    });
  };
});

function testNullObject(obj: Object | null): boolean {
  if (obj !== null) {
    console.error(`Object is not null. got ${typeof(obj)}`);
    return false;
  }
  return true;
}

describe("Evaluate return statements", () => {
  const tests = [
    { input: "return 10;", expected: 10 },
    { input: "return 10; 9;", expected: 10 },
    { input: "return 2 * 5; 9;", expected: 10 },
    { input: "9; return 2 * 5; 9;", expected: 10 },
    { input:
      ` if (10 > 1) {
           if (10 > 1) {
             return 10;
      }
      return 1; }
      `, expected: 10
    },
  ];

  for (const { input, expected } of tests) {
    it(`should evaluate ${input} to ${expected}`, () => {
      const evaluated = testEval(input); 
      testIntegerObject(evaluated, expected);
    });
  };
});

describe("Error handling", () => {
  const tests = [
    {
      input: "5 + true;",
      expected: "type mismatch: INTEGER + BOOLEAN",
    },
    {
      input: "5 + true; 5;",
      expected: "type mismatch: INTEGER + BOOLEAN",
    },
    {
      input: "-true",
      expected: "unknown operator: -BOOLEAN",
    },
    {
      input: "true + false;",
      expected: "unknown operator: BOOLEAN + BOOLEAN",
    }, {
      input: "5; true + false; 5",
      expected: "unknown operator: BOOLEAN + BOOLEAN",
    },
    {
      input: "if (10 > 1) { true + false; }",
      expected: "unknown operator: BOOLEAN + BOOLEAN", }, 
    {
      input:
        ` if (10 > 1) {
          if (10 > 1) {
            return true + false;
        }
        return 1; }`, 
      expected: "unknown operator: BOOLEAN + BOOLEAN"
    },
    { input: "foobar", expected: "identifier not found: foobar" }
  ];

  for (const { input, expected } of tests) {
    it(`should evaluate ${input} to ${expected}`, () => {
      const evaluated = testEval(input); 
      const errObj = evaluated as ErrorVal;
      if (!errObj) {
        console.error(`No error object returned. Got=${typeof evaluated}(${evaluated})`);
      }
      if (errObj.message !== expected) {
        console.error(`Wrong error message. Expected=${expected}, got=${errObj.message}`);
      }
    });
  };
});

describe("Evaluate let statements", () => {
  const tests = [
    { input: "let a = 5; a;", expected: 5 },
    { input: "let a = 5 * 5; a;", expected: 25},
    { input: "let a = 5; let b = a; b;", expected: 5 },
    { input: "let a = 5; let b = a; let c = a + b + 5; c;", expected: 15},
  ];

  tests.forEach((test) => {
    it(`should evaluate ${test.input} to ${test.expected}`, () => {
      const evaluated = testEval(test.input); 
      expect(evaluated).toBeInstanceOf(IntegerVal);
      testIntegerObject(evaluated, test.expected);
    });
  });
});

describe("Evaluate function object", () => {
  const input = "fn(x) { x + 2 ; };";

  const evaluated = testEval(input); 
  expect(evaluated).toBeInstanceOf(FunctionVal);

  const fn: FunctionVal = evaluated as FunctionVal;
  expect(fn.parameters?.length).toBe(1);
  expect(fn.parameters![0].string()).toBe("x");

  const expected = "(x + 2)";

  it(`should evaluate ${input} to ${expected}`, () => {
    expect(fn.body?.string()).toBe(expected);
  });
});

describe("Evaluate function application", () => {
  const tests = [
     { input: "let identity = fn(x) { x; }; identity(5);", expected: 5 },
     { input: "let identity = fn(x) { return x; }; identity(5);", expected: 5 },
     { input: "let double = fn(x) { x * 2; }; double(5);", expected: 10 },
     { input: "let add = fn(x, y) { x + y; }; add(5, 5);", expected: 10 },
     { input: "let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));", expected: 20 },
     { input: "fn(x) { x; }(5)", expected: 5 },
  ];

  for (let { input, expected } of tests) {
    it(`should evaluate ${input} to ${expected}`, () => {
      const evaluated = testEval(input); 
      testIntegerObject(evaluated, expected);
    });
  }
});

describe("Function closures", () => {
  const input = `
   let newAdder = fn(x) {
     fn(y) { x + y };
   };
   let addTwo = newAdder(2);
   addTwo(2);`

  it(`should evaluate ${input} to ${4}`, () => {
    const evaluated = testEval(input); 
    testIntegerObject(evaluated, 4);
  });
});

describe("Evaluate string literals", () => {
  const input = `"Hello World!"`;

  const evaluated = testEval(input); 
  it(`should evaluate ${input} to string literal`, () => {
    expect(evaluated).toBeInstanceOf(StringVal);
    const str = evaluated as StringVal;
    expect(str.value).toBe("Hello World!");
  });
});
