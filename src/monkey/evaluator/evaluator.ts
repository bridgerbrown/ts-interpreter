import { Boolean, Expression, ExpressionStatement, IntegerLiteral, PrefixExpression, Program, Statement } from "../ast/ast";
import { BooleanVal, IntegerVal, NullVal, Object, Objects } from "../object/object";

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
    case node instanceof PrefixExpression:
      const right = evaluate(node.right);
      return evalPrefixExpression(node.operator, right);
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

function evalPrefixExpression(operator: string, right: Object | null): Object | null {
  switch (operator) {
    case "!":
      return evalExclOperatorExpression(right);
    case "-":
      return evalMinusPrefixOperatorExpression(right);
    default:
      return primitives.NULL;
  }
}

function evalExclOperatorExpression(right: Object | null): Object {
  const { TRUE, FALSE, NULL } = primitives;
  switch (right) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    case NULL:
      return TRUE;
    default:
      return FALSE;
  }
}

function evalMinusPrefixOperatorExpression(right: Object | null): Object | null {
  if (right?.type() !== Objects.Integer_Obj) return null;
  return new IntegerVal(-(right as IntegerVal).value);
}

