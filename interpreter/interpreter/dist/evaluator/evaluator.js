import { ArrayLiteral, BlockStatement, Boolean, CallExpression, ExpressionStatement, FunctionLiteral, Identifier, IfExpression, IndexExpression, InfixExpression, IntegerLiteral, LetStatement, PrefixExpression, Program, ReturnStatement, StringLiteral } from "../ast/ast";
import { ArrayVal, BooleanVal, BuiltIn, ErrorVal, FunctionVal, IntegerVal, NullVal, ReturnVal, StringVal } from "../object/object";
import { Environment } from "../object/environment";
import { builtins } from "./builtins";
export function evaluate(node, env) {
    let right;
    let left;
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
            if (isError(right))
                return right;
            return evalPrefixExpression(node.operator, right);
        case node instanceof InfixExpression:
            left = evaluate(node.left, env);
            if (isError(left))
                return left;
            right = evaluate(node.right, env);
            if (isError(right))
                return right;
            return evalInfixExpression(node.operator, left, right);
        case node instanceof BlockStatement:
            return evalBlockStatement(node, env);
        case node instanceof IfExpression:
            return evalIfExpression(node, env);
        case node instanceof ReturnStatement:
            val = evaluate(node.returnValue, env);
            if (isError(val))
                return val;
            return new ReturnVal(val);
        case node instanceof LetStatement:
            val = evaluate(node.value, env);
            if (isError(val))
                return val;
            env.set(node.name.value, val);
            return val;
        case node instanceof Identifier:
            return evalIdentifier(node, env);
        case node instanceof FunctionLiteral:
            const params = node.parameters;
            const body = node.body;
            return new FunctionVal(params, body, env);
        case node instanceof CallExpression:
            const fn = evaluate(node.fn, env);
            if (isError(fn))
                return fn;
            const args = evalExpressions(node.args, env);
            if (args.length == 1 && isError(args[0]))
                return args[0];
            return applyFunction(fn, args);
        case node instanceof StringLiteral:
            return new StringVal(node.value);
        case node instanceof ArrayLiteral:
            const elements = evalExpressions(node.elements, env);
            if (elements.length === 1 && isError(elements[0]))
                return elements[0];
            return new ArrayVal(elements);
        case node instanceof IndexExpression:
            left = evaluate(node.left, env);
            if (isError(left))
                return left;
            const index = evaluate(node.index, env);
            if (isError(index))
                return index;
            return evalIndexExpression(left, index);
        default:
            return primitives.NULL;
    }
}
function evalProgram(statements, env) {
    let result = null;
    for (const statement of statements) {
        result = evaluate(statement, env);
        switch (true) {
            case (result instanceof ReturnVal):
                return result.value;
            case (result instanceof ErrorVal):
                return result;
        }
    }
    return result;
}
export const primitives = {
    "NULL": new NullVal(),
    "TRUE": new BooleanVal(true),
    "FALSE": new BooleanVal(false)
};
function nativeBoolToBooleanObject(input) {
    if (input)
        return primitives.TRUE;
    return primitives.FALSE;
}
function evalPrefixExpression(operator, right) {
    switch (operator) {
        case "!":
            return evalExclOperatorExpression(right);
        case "-":
            return evalMinusPrefixOperatorExpression(right);
        default:
            return newError("unknown operator:", operator, right?.type());
    }
}
function evalExclOperatorExpression(right) {
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
function evalMinusPrefixOperatorExpression(right) {
    if (right?.type() !== "INTEGER" /* Objects.Integer_Obj */) {
        return newError("unknown operator: ", right?.type());
    }
    return new IntegerVal(-right.value);
}
function evalInfixExpression(operator, left, right) {
    switch (true) {
        case (left.type() === "INTEGER" /* Objects.Integer_Obj */ && right?.type() === "INTEGER" /* Objects.Integer_Obj */):
            return evalIntegerInfixExpression(operator, left, right);
        case (operator == "=="):
            return nativeBoolToBooleanObject(left == right);
        case (operator == "!="):
            return nativeBoolToBooleanObject(left != right);
        case (left.type() != right?.type()):
            return newError("type mismatch:", left.type(), operator, right?.type());
        case (left.type() === "STRING" /* Objects.String_Obj */ && right?.type() === "STRING" /* Objects.String_Obj */):
            return evalStringInfixExpression(operator, left, right);
        default:
            return newError("unknown operator:", left.type(), operator, right?.type());
    }
}
function evalIntegerInfixExpression(operator, left, right) {
    const leftVal = new IntegerVal(left.value).value;
    const rightVal = new IntegerVal(right.value).value;
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
function evalIfExpression(ie, env) {
    const condition = evaluate(ie?.condition, env);
    if (isError(condition))
        return condition;
    if (isTruthy(condition)) {
        return evaluate(ie?.consequence, env);
    }
    else if (ie?.alternative != null) {
        return evaluate(ie.alternative, env);
    }
    else {
        return primitives.NULL;
    }
}
function isTruthy(obj) {
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
function evalBlockStatement(block, env) {
    let result = null;
    if (block && block.statements) {
        for (let statement of block.statements) {
            result = evaluate(statement, env);
            if (result !== null) {
                const rt = result.type();
                if (rt == "RETURN_VALUE" /* Objects.Return_Value_Obj */ || rt == "ERROR" /* Objects.Error_Obj */) {
                    return result;
                }
            }
        }
    }
    return result;
}
export function newError(format, ...a) {
    const error = format.replace(/{(\d+)}/g, (match, number) => {
        return typeof a[number] !== 'undefined' ? a[number] : match;
    });
    return new ErrorVal(error);
}
function isError(obj) {
    if (obj !== null) {
        return obj.type() == "ERROR" /* Objects.Error_Obj */;
    }
    return false;
}
function evalIdentifier(node, env) {
    const val = env.get(node.value);
    if (val)
        return val;
    const builtin = builtins[node.value];
    if (builtin)
        return builtin;
    return newError("identifier not found: " + node.value);
}
function evalExpressions(exps, env) {
    const result = [];
    if (exps) {
        for (let e of exps) {
            let evaluated = evaluate(e, env);
            if (isError(evaluated))
                return [evaluated];
            result.push(evaluated);
        }
    }
    return result;
}
function applyFunction(fn, args) {
    switch (true) {
        case (fn instanceof FunctionVal):
            const extendedEnv = extendFunctionEnv(fn, args);
            const evaluated = evaluate(fn.body, extendedEnv);
            return unwrapReturnValue(evaluated);
        case (fn instanceof BuiltIn):
            return fn.fn(...args);
        default:
            return newError(`not a function: ${fn?.type()}`);
    }
}
function extendFunctionEnv(fn, args) {
    let env = new Environment();
    if (fn?.parameters) {
        env = new Environment(fn.env);
        for (let i = 0; i < fn.parameters.length; i++) {
            const param = fn.parameters[i];
            env.set(param.value, args[i]);
        }
    }
    return env;
}
function unwrapReturnValue(obj) {
    if (obj instanceof ReturnVal)
        return obj.value;
    return obj;
}
function evalStringInfixExpression(operator, left, right) {
    if (operator !== "+") {
        return newError(`unknown operator: ${left.type()} ${operator} ${right?.type()}`);
    }
    const leftVal = left.value;
    const rightVal = right.value;
    return new StringVal(leftVal + rightVal);
}
function evalIndexExpression(left, index) {
    switch (true) {
        case (left && index && left.type() === "ARRAY" /* Objects.Array_Obj */ && index.type() === "INTEGER" /* Objects.Integer_Obj */):
            return evalArrayIndexExpression(left, index);
        default:
            return newError(`index operator not supported: ${left?.type()}`);
    }
}
function evalArrayIndexExpression(array, index) {
    const arrayObject = array;
    const idx = index.value;
    const max = arrayObject.elements.length - 1;
    if (idx < 0 || idx > max)
        return primitives.NULL;
    return arrayObject.elements[idx];
}
