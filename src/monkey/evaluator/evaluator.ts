import { BlockStatement, Boolean, CallExpression, Expression, ExpressionStatement, FunctionLiteral, Identifier, IfExpression, InfixExpression, IntegerLiteral, LetStatement, PrefixExpression, Program, ReturnStatement, Statement } from "../ast/ast";
import { BooleanVal, ErrorVal, FunctionVal, IntegerVal, NullVal, Object, Objects, ReturnVal } from "../object/object";
import { Environment } from "../object/environment";

export function evaluate(node: any, env: Environment): Object | null {
  let right: Object | null;
  let left: Object | null;
  let val;

  switch (true) {
    case node instanceof Program:
      return evalProgram(node.statements, env);
    case node instanceof ExpressionStatement:
      return evaluate(node.expression, env);
    case node instanceof IntegerLiteral:
      return new IntegerVal(node.value);
    case node instanceof Boolean:
      return nativeBoolToBooleanObject(node.value);
    case node instanceof PrefixExpression:
      right = evaluate(node.right, env);
      if (isError(right)) return right;
      return evalPrefixExpression(node.operator, right);
    case node instanceof InfixExpression:
      left = evaluate(node.left, env);
      if (isError(left)) return left;
      right = evaluate(node.right, env);
      if (isError(right)) return right;
      return evalInfixExpression(node.operator, left, right);
    case node instanceof BlockStatement:
      return evalBlockStatement(node, env);
    case node instanceof IfExpression:
      return evalIfExpression(node, env);
    case node instanceof ReturnStatement:
      val = evaluate(node.returnValue, env);
      if (isError(val)) return val;
      return new ReturnVal(val);
    case node instanceof LetStatement:
      val = evaluate(node.value, env);
      if (isError(val)) return val;
      env.set(node.name!.value, val);
      return val;
    case node instanceof Identifier:
      return evalIdentifier(node, env);
    case node instanceof FunctionLiteral:
      const params = node.parameters;
      const body = node.body;
      return new FunctionVal(params, body, env);
    case node instanceof CallExpression:
      const fn = evaluate(node.fn, env);
      if (isError(fn)) return fn;
      const args = evalExpressions(node.args, env);
      if (args.length == 1 && isError(args[0])) return args[0];
      return applyFunction(fn, args);
    default:
      return primitives.NULL;
  }
}

function evalProgram(statements: Statement[], env: Environment): Object | null {
  let result: Object | null = null;

  for (const statement of statements) {
    result = evaluate(statement, env);
    switch (true) {
      case (result instanceof ReturnVal):
        return (result as ReturnVal).value;
      case (result instanceof ErrorVal):
        return result;
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
      return newError("unknown operator:", operator, right?.type());
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
  if (right?.type() !== Objects.Integer_Obj) {
    return newError("unknown operator: ", right?.type());
  }
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
    case (left.type() != right?.type()):
      return newError("type mismatch:", left.type(), operator, right?.type());
    default:
      return newError("unknown operator:", left.type(), operator, right?.type());
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
      return newError("unknown operator: ", left.type(), operator, right?.type());
  }
}

function evalIfExpression(ie: IfExpression | null, env: Environment): Object | null {
  const condition = evaluate(ie?.condition, env);
  if (isError(condition)) return condition;

  if (isTruthy(condition)) {
    return evaluate(ie?.consequence, env);
  } else if (ie?.alternative != null) {
    return evaluate(ie.alternative, env);
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

function evalBlockStatement(block: BlockStatement | null, env: Environment): Object | null {
  let result: Object | null = null;

  if (block && block.statements) {
    for (let statement of block.statements) {
      result = evaluate(statement, env);
      if (result !== null) {
        const rt = result.type();
        if (rt == Objects.Return_Value_Obj || rt == Objects.Error_Obj) {
          return result;
        }
      }
    }
  }
  return result;
}

function newError(format: string, ...a: any[]): ErrorVal | null {
  const error = format.replace(/{(\d+)}/g, (match, number) => {
    return typeof a[number] !== 'undefined' ? a[number] : match;
  });
  return new ErrorVal(error);
}

function isError(obj: Object | null): boolean {
  if (obj !== null) {
    return obj.type() == Objects.Error_Obj;
  }
  return false;
}

function evalIdentifier(node: any, env: Environment) {
  const val = env.get(node.value);
  if (!val) return newError("identifier not found: " + node.value);
  return val;
}

function evalExpressions(exps: (Expression | null)[] | null, env: Environment): (Object | null)[] {
  const result: (Object | null)[] = [];

  if (exps) {
    for (let e of exps) {
      let evaluated = evaluate(e, env);
      if (isError(evaluated)) return [evaluated];
      result.push(evaluated);
    }
  }
  return result;
}

function applyFunction(fn: Object | null, args: (Object | null)[]): Object | null {
  if (!(fn as FunctionVal)) return newError(`not a function: ${fn?.type()}`);
  const fnObj = fn as FunctionVal;
  const extendedEnv = extendFunctionEnv(fnObj, args);
  const evaluated = evaluate(fnObj.body, extendedEnv);
  return unwrapReturnValue(evaluated);
}

function extendFunctionEnv(fn: FunctionVal | null, args: (Object | null)[]): Environment {
  let env: Environment = new Environment();
  if (fn?.parameters) {
    env = new Environment(fn.env);
    for (let i = 0; i < fn.parameters.length; i++) {
      const param = fn.parameters[i];
      env.set(param.value, args[i]);
    }
  }
  return env;
}

function unwrapReturnValue(obj: Object | null): Object | null {
  if (obj instanceof ReturnVal) return obj.value;
  return obj;
}
