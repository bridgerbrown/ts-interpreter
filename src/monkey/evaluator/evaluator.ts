import { Boolean, Expression, ExpressionStatement, IntegerLiteral, Program, Statement } from "../ast/ast";
import { BooleanVal, IntegerVal, NullVal, Object } from "../object/object";

export function evaluate(node: any): Object | null {
  switch (true) {
    case node instanceof Program:
      return evalStatements(node.statements);
    case node instanceof ExpressionStatement:
      return evaluate(node.expression);
    case node instanceof IntegerLiteral:
      return new IntegerVal(node.value);
    case node instanceof Boolean:
      return nativeBoolToBooleanObject(node.value);
    default:
      return null;
  }
}

function evalStatements(statements: Statement[]): Object | null {
  let result: Object | null = null;
  for (const statement of statements) {
    result = evaluate(statement);
    return result;
  }
  return result;
}

const primitives = {
  "NULL": new NullVal(),
  "TRUE": new BooleanVal(true),
  "FALSE": new BooleanVal(false)
};

function nativeBoolToBooleanObject(input: boolean): BooleanVal {
  if (input) return primitives.TRUE;
  return primitives.FALSE;
}
