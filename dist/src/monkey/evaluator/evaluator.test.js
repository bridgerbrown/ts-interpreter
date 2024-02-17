import { Lexer } from "../lexer/lexer";
import { ArrayVal, BooleanVal, FunctionVal, HashVal, IntegerVal, StringVal } from "../object/object";
import { Environment } from "../object/environment";
import { Parser } from "../parser/parser";
import { evaluate, primitives } from "./evaluator";
function testEval(input) {
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
function testIntegerObject(obj, expected) {
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
function testBooleanObject(obj, expected) {
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
            }
            else {
                testNullObject(evaluated);
            }
        });
    }
    ;
});
function testNullObject(obj) {
    if (obj !== null) {
        console.error(`Object is not null. got ${typeof (obj)}`);
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
        { input: ` if (10 > 1) {
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
    }
    ;
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
            expected: "unknown operator: BOOLEAN + BOOLEAN",
        },
        {
            input: ` if (10 > 1) {
          if (10 > 1) {
            return true + false;
        }
        return 1; }`,
            expected: "unknown operator: BOOLEAN + BOOLEAN"
        },
        { input: "foobar", expected: "identifier not found: foobar" },
        { input: `"Hello" - "World"`, expected: "unknown operator: STRING - STRING" }
    ];
    for (const { input, expected } of tests) {
        it(`should evaluate ${input} to ${expected}`, () => {
            const evaluated = testEval(input);
            const errObj = evaluated;
            if (!errObj) {
                console.error(`No error object returned. Got=${typeof evaluated}(${evaluated})`);
            }
            if (errObj.message !== expected) {
                console.error(`Wrong error message. Expected=${expected}, got=${errObj.message}`);
            }
        });
    }
    ;
});
describe("Evaluate let statements", () => {
    const tests = [
        { input: "let a = 5; a;", expected: 5 },
        { input: "let a = 5 * 5; a;", expected: 25 },
        { input: "let a = 5; let b = a; b;", expected: 5 },
        { input: "let a = 5; let b = a; let c = a + b + 5; c;", expected: 15 },
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
    const fn = evaluated;
    expect(fn.parameters?.length).toBe(1);
    expect(fn.parameters[0].string()).toBe("x");
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
   addTwo(2);`;
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
        const str = evaluated;
        expect(str.value).toBe("Hello World!");
    });
});
describe("Evaluate string concatenation", () => {
    const input = `"Hello" + " " + "World!"`;
    const evaluated = testEval(input);
    const expected = "Hello World!";
    it(`should evaluate ${input} to ${expected}`, () => {
        expect(evaluated).toBeInstanceOf(StringVal);
        const str = evaluated;
        expect(str.value).toBe(expected);
    });
});
describe("Evaluate built-in functions", () => {
    const tests = [
        { input: `len("")`, expected: 0 },
        { input: `len("four")`, expected: 4 },
        { input: `len("hello world")`, expected: 11 },
        { input: `len(1)`, expected: "argument to 'len' not supported, got INTEGER" },
        { input: `len("one", "two")`, expected: "wrong number of arguments. got=2, want=1" },
    ];
    for (const { input, expected } of tests) {
        test(input, () => {
            const evaluated = testEval(input);
            switch (typeof expected) {
                case ('number'):
                    testIntegerObject(evaluated, Number(expected));
                    break;
                case ('string'):
                    const errObj = evaluated;
                    expect(errObj.message).toBe(expected);
                    break;
            }
        });
    }
    ;
});
describe("Evaluate built-in functions", () => {
    const input = "[1, 2 * 2, 3 + 3]";
    const evaluated = testEval(input);
    it("should evaluate array integer objects", () => {
        expect(evaluated).toBeInstanceOf(ArrayVal);
        const array = evaluated;
        testIntegerObject(array.elements[0], 1);
        testIntegerObject(array.elements[1], 4);
        testIntegerObject(array.elements[2], 6);
    });
});
describe("Evaluate array index expressions", () => {
    const tests = [
        { input: "[1, 2, 3][0]", expected: 1, },
        { input: "[1, 2, 3][1]", expected: 2, },
        { input: "[1, 2, 3][2]", expected: 3, },
        { input: "let i = 0; [1][i];", expected: 1, },
        { input: "[1, 2, 3][1 + 1];", expected: 3, },
        { input: "let myArray = [1, 2, 3]; myArray[2];", expected: 3, },
        { input: "let myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];", expected: 6, },
        { input: "let myArray = [1, 2, 3]; let i = myArray[0]; myArray[i]", expected: 2, },
        { input: "[1, 2, 3][3]", expected: null },
        { input: "[1, 2, 3][-1]", expected: null },
    ];
    for (const { input, expected } of tests) {
        it(`should evaluate ${input} to ${expected}`, () => {
            const evaluated = testEval(input);
            if (typeof expected === "number") {
                testIntegerObject(evaluated, expected);
            }
            else {
                testNullObject(evaluated);
            }
        });
    }
    ;
});
describe("Evaluate hash literals", () => {
    const input = `{
    "one": 10 - 9,
    two: 1 + 1,
    "thr" + "ee": 6 / 2,
    4: 4,
    true: 5,
    false: 6
  }`;
    const evaluated = testEval(input);
    expect(evaluated).toBeInstanceOf(HashVal);
    const result = evaluated;
    const expected = new Map();
    expected.set((new StringVal("one")).hashKey(), 1);
    expected.set((new StringVal("two")).hashKey(), 2);
    expected.set((new StringVal("three")).hashKey(), 3);
    expected.set((new IntegerVal(4)).hashKey(), 4);
    expected.set(primitives.TRUE.hashKey(), 5);
    expected.set(primitives.FALSE.hashKey(), 6);
    expect(result.pairs.size).toBe(expected.size);
    it(`should evaluate ${input} to ${expected}`, () => {
        for (const [key, value] of expected) {
            const pair = result.pairs.get(key);
            expect(pair?.value).toEqual(value);
        }
    });
});
