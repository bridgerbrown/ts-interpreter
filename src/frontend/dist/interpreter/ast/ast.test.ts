import { TokenType } from "../token/token"
import { Identifier, LetStatement, Program } from "./ast"

describe("Program string()", () => {
  test("should return correct string representation", () => {
    const program = new Program();
    program.statements = [
      new LetStatement(
        { type: TokenType.Let, literal: 'let' },
        new Identifier({ type: TokenType.Ident, literal: 'myVar' }),
        new Identifier({ type: TokenType.Ident, literal: 'anotherVar' })
      ),
    ];

    const expected = 'let myVar = anotherVar;';
    const result = program.string();
    expect(result).toBe(expected);
  })
})
