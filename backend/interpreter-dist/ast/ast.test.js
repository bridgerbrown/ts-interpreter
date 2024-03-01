"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../token/token");
const ast_1 = require("./ast");
describe("Program string()", () => {
    test("should return correct string representation", () => {
        const program = new ast_1.Program();
        program.statements = [
            new ast_1.LetStatement({ type: token_1.TokenType.Let, literal: 'let' }, new ast_1.Identifier({ type: token_1.TokenType.Ident, literal: 'myVar' }), new ast_1.Identifier({ type: token_1.TokenType.Ident, literal: 'anotherVar' })),
        ];
        const expected = 'let myVar = anotherVar;';
        const result = program.string();
        expect(result).toBe(expected);
    });
});
