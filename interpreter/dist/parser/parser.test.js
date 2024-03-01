"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("../lexer/lexer");
const parser_1 = require("./parser");
const ast_1 = require("../ast/ast");
const token_1 = require("../token/token");
describe("Let statements", () => {
    const input = `let x = 5; let y = 10; let foobar = 838383;`;
    const lexer = new lexer_1.Lexer(input);
    const parser = new parser_1.Parser(lexer);
    const program = parser.parseProgram();
    const expected = new ast_1.Program();
    expected.statements = [
        new ast_1.LetStatement({ type: token_1.TokenType.Let, literal: "let" }, new ast_1.Identifier({ type: token_1.TokenType.Ident, literal: "x" }), new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "5" }, 5)),
        new ast_1.LetStatement({ type: token_1.TokenType.Let, literal: "let" }, new ast_1.Identifier({ type: token_1.TokenType.Ident, literal: "y" }), new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "10" }, 10)),
        new ast_1.LetStatement({ type: token_1.TokenType.Let, literal: "let" }, new ast_1.Identifier({ type: token_1.TokenType.Ident, literal: "foobar" }), new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "838383" }, 838383)),
    ];
    it(`should parse let statements`, () => {
        expect(program.statements.length).toBe(3);
        expect(program.statements[0]).toBeInstanceOf(ast_1.LetStatement);
        expect(program.statements.length).toBe(expected.statements.length);
    });
});
describe("Identifier expressions", () => {
    const input = "foobar;";
    const lexer = new lexer_1.Lexer(input);
    const parser = new parser_1.Parser(lexer);
    const program = parser.parseProgram();
    parser.checkParserErrors();
    const expected = new ast_1.Program();
    expected.statements = [
        new ast_1.ExpressionStatement({ type: token_1.TokenType.Ident, literal: "foobar" }, new ast_1.Identifier({ type: token_1.TokenType.Ident, literal: "foobar" }))
    ];
    it(`should parse identifier expressions`, () => {
        var _a, _b;
        expect(program.statements.length).toBe(expected.statements.length);
        const actual = program.statements[0];
        const expectedStatement = expected.statements[0];
        expect(actual).toBeInstanceOf(ast_1.ExpressionStatement);
        expect((_a = actual.expression) === null || _a === void 0 ? void 0 : _a.tokenLiteral()).toEqual((_b = expectedStatement.expression) === null || _b === void 0 ? void 0 : _b.tokenLiteral());
    });
});
describe("Integer literal expression", () => {
    const input = "5;";
    const lexer = new lexer_1.Lexer(input);
    const parser = new parser_1.Parser(lexer);
    const program = parser.parseProgram();
    parser.checkParserErrors();
    const expected = new ast_1.Program();
    expected.statements = [
        new ast_1.ExpressionStatement({ type: token_1.TokenType.Int, literal: "5" }, new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "5" }, 5))
    ];
    it(`should parse integer literal expressions`, () => {
        expect(program.statements.length).toBe(expected.statements.length);
        const statement = program.statements[0];
        const literal = statement.expression;
        expect(literal).toBeInstanceOf(ast_1.IntegerLiteral);
        expect(literal === null || literal === void 0 ? void 0 : literal.tokenLiteral()).toBe("5");
    });
});
describe("String literal expression", () => {
    const input = `"hello world";`;
    const lexer = new lexer_1.Lexer(input);
    const parser = new parser_1.Parser(lexer);
    const program = parser.parseProgram();
    parser.checkParserErrors();
    const expected = new ast_1.Program();
    expected.statements = [
        new ast_1.ExpressionStatement({ type: token_1.TokenType.String, literal: `"hello world";` }, new ast_1.StringLiteral({ type: token_1.TokenType.String, literal: `"hello world"` }, "hello world"))
    ];
    it(`should parse string literal expressions`, () => {
        expect(program.statements.length).toBe(expected.statements.length);
        const statement = program.statements[0];
        const literal = statement.expression;
        expect(literal).toBeInstanceOf(ast_1.StringLiteral);
        expect(literal === null || literal === void 0 ? void 0 : literal.tokenLiteral()).toBe("hello world");
    });
});
describe("Parsing array literals", () => {
    const input = "[1, 2 * 2, 3 + 3]";
    const lexer = new lexer_1.Lexer(input);
    const parser = new parser_1.Parser(lexer);
    const program = parser.parseProgram();
    parser.checkParserErrors();
    const expected = new ast_1.Program();
    expected.statements = [
        new ast_1.ExpressionStatement({ type: token_1.TokenType.String, literal: "[1, 2 * 2, 3 + 3]" }, new ast_1.ArrayLiteral({ type: token_1.TokenType.String, literal: "[1, 2 * 2, 3 + 3]" }, [
            new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "1" }, 1),
            new ast_1.InfixExpression({ type: token_1.TokenType.String, literal: "2 * 2" }, "*", new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "2" }, 2), new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "2" }, 2)),
            new ast_1.InfixExpression({ type: token_1.TokenType.String, literal: "3 + 3" }, "+", new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "3" }, 3), new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "3" }, 3))
        ]))
    ];
    it(`should parse array literal expressions`, () => {
        var _a;
        const statement = expected.statements[0];
        const array = statement.expression;
        expect(array).toBeInstanceOf(ast_1.ArrayLiteral);
        expect((_a = array.elements) === null || _a === void 0 ? void 0 : _a.length).toBe(3);
        testIntegerLiteral(array.elements[0], 1);
        testInfixExpression(array.elements[1], 2, "*", 2);
        testInfixExpression(array.elements[2], 3, "+", 3);
    });
});
function testIntegerLiteral(expression, value) {
    expect(expression).toBeInstanceOf(ast_1.IntegerLiteral);
    const integer = expression;
    expect(integer.value).toBe(value);
}
function testInfixExpression(expression, leftValue, operator, rightValue) {
    expect(expression).toBeInstanceOf(ast_1.InfixExpression);
    const infix = expression;
    testIntegerLiteral(infix.left, leftValue);
    expect(infix.operator).toBe(operator);
    testIntegerLiteral(infix.right, rightValue);
}
describe("Parsing index expressions", () => {
    const input = "myArray[1 + 1]";
    const lexer = new lexer_1.Lexer(input);
    const parser = new parser_1.Parser(lexer);
    const program = parser.parseProgram();
    parser.checkParserErrors();
    const expected = new ast_1.Program();
    expected.statements = [
        new ast_1.ExpressionStatement({ type: token_1.TokenType.String, literal: "myArray[1 + 1]" }, new ast_1.IndexExpression({ type: token_1.TokenType.LBracket, literal: "[" }, new ast_1.Identifier({ type: token_1.TokenType.Ident, literal: "myArray" }), new ast_1.InfixExpression({ type: token_1.TokenType.Plus, literal: "+" }, "+", new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "1" }, 1), new ast_1.IntegerLiteral({ type: token_1.TokenType.Int, literal: "1" }, 1))))
    ];
    it(`should parse index expressions`, () => {
        const statement = program.statements[0];
        const literal = statement.expression;
        expect(literal).toBeInstanceOf(ast_1.IndexExpression);
    });
});
