import { BlockStatement, Boolean, Expression, ExpressionStatement, IfExpression, InfixExpression, IntegerLiteral, PrefixExpression, Program, ReturnStatement, Statement } from "../ast/ast";
import { BooleanVal, IntegerVal, NullVal, Object, Objects, ReturnVal } from "../object/object";

export function evaluate(node: any): Object | null {
  let right: Object | null;
  let left: Object | null;

  switch (true) {
    case node instanceof Program:
      return evalProgram(node.statements);
    case node instanceof ExpressionStatement:
      return evaluate(node.expression);
    case node instanceof IntegerLiteral:
      return new IntegerVal(node.value);
    case node instanceof Boolean:
      return nativeBoolToBooleanObject(node.value);
    case node instanceof PrefixExpression:
      right = evaluate(node.right);
      return evalPrefixExpression(node.operator, right);
    case node instanceof InfixExpression:
      left = evaluate(node.left);
      right = evaluate(node.right);
      return evalInfixExpression(node.operator, left, right);
    case node instanceof BlockStatement:
      return evalBlockStatement(node);
    case node instanceof IfExpression:
      return evalIfExpression(node);
    case node instanceof ReturnStatement:
      let val = evaluate(node.returnValue);
      return new ReturnVal(val);
    default:
      return null;
  }
}

function evalProgram(statements: Statement[]): Object | null {
  let result: Object | null = null;
  for (const statement of statements) {
    result = evaluate(statement);
    if (result instanceof ReturnVal) {
      return result.value;
    }
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
  if (right?.type() !== Objects.Integer_Obj) return primitives.NULL;
  return new IntegerVal(-(right as IntegerVal).value);
}

function evalInfixExpression(operator: string, left: any, right: Object | null): Object | null {
  switch (true) {
    case (left.type() === Objects.Integer_Obj && right?.type() === Objects.Integer_Obj):
      return evalIntegerInfixExpression(operator, left, right);
    case (operator == "=="):
      return nativeBoolToBooleanObject(left == right);
    case (operator == "!="):
      return nativeBoolToBooleanObject(left != right);
    default:
      return primitives.NULL;
  }
}

function evalIntegerInfixExpression(operator: string, left: any, right: Object | null): Object | null {
  const leftVal = new IntegerVal((left as IntegerVal).value).value; 
  const rightVal = new IntegerVal((right as IntegerVal).value).value; 

  switch (operator) {
    case "+":
      return new IntegerVal(leftVal + rightVal);
    case "-":
      return new IntegerVal(leftVal - rightVal);
    case "*":
      return new IntegerVal(leftVal * rightVal);
    case "/":
      return new IntegerVal(leftVal / rightVal);
    case "<":
      return nativeBoolToBooleanObject(leftVal < rightVal);
    case ">":
      return nativeBoolToBooleanObject(leftVal > rightVal);
    case "==":
      return nativeBoolToBooleanObject(leftVal == rightVal);
    case "!=":
      return nativeBoolToBooleanObject(leftVal != rightVal);
    default:
      return primitives.NULL;
  }
}

function evalIfExpression(ie: IfExpression | null): Object | null {
  const condition = evaluate(ie?.condition);

  if (isTruthy(condition)) {
    return evaluate(ie?.consequence);
  } else if (ie?.alternative != null) {
    return evaluate(ie.alternative);
  } else {
    return primitives.NULL;
  }
}

function isTruthy(obj: Object | null): boolean {
  const { NULL, TRUE, FALSE } = primitives;
  switch (obj) {
    case NULL:
      return false;
    case TRUE:
      return true;
    case FALSE:
      return false;
    default:
      return true;
  }
}

function evalBlockStatement(block: BlockStatement | null): Object | null {
  let result: Object | null = null;
  if (block && block.statements) {
    for (let statement of block.statements) {
      result = evaluate(statement);
      if (result !== null && result.type() == Objects.Return_Value_Obj) {
        return result;
      }
    }
  }
  return result;
}
