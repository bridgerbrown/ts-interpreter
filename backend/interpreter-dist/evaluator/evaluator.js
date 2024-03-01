"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newError = exports.primitives = exports.evaluate = void 0;
const ast_1 = require("../ast/ast");
const object_1 = require("../object/object");
const environment_1 = require("../object/environment");
const builtins_1 = require("./builtins");
function evaluate(node, env) {
    let right;
    let left;
    let val;
    switch (true) {
        case node instanceof ast_1.Program:
            return evalProgram(node.statements, env);
        case node instanceof ast_1.ExpressionStatement:
            return evaluate(node.expression, env);
        case node instanceof ast_1.IntegerLiteral:
            return new object_1.IntegerVal(node.value);
        case node instanceof ast_1.Boolean:
            return nativeBoolToBooleanObject(node.value);
        case node instanceof ast_1.PrefixExpression:
            right = evaluate(node.right, env);
            if (isError(right))
                return right;
            return evalPrefixExpression(node.operator, right);
        case node instanceof ast_1.InfixExpression:
            left = evaluate(node.left, env);
            if (isError(left))
                return left;
            right = evaluate(node.right, env);
            if (isError(right))
                return right;
            return evalInfixExpression(node.operator, left, right);
        case node instanceof ast_1.BlockStatement:
            return evalBlockStatement(node, env);
        case node instanceof ast_1.IfExpression:
            return evalIfExpression(node, env);
        case node instanceof ast_1.ReturnStatement:
            val = evaluate(node.returnValue, env);
            if (isError(val))
                return val;
            return new object_1.ReturnVal(val);
        case node instanceof ast_1.LetStatement:
            val = evaluate(node.value, env);
            if (isError(val))
                return val;
            env.set(node.name.value, val);
            return val;
        case node instanceof ast_1.Identifier:
            return evalIdentifier(node, env);
        case node instanceof ast_1.FunctionLiteral:
            const params = node.parameters;
            const body = node.body;
            return new object_1.FunctionVal(params, body, env);
        case node instanceof ast_1.CallExpression:
            const fn = evaluate(node.fn, env);
            if (isError(fn))
                return fn;
            const args = evalExpressions(node.args, env);
            if (args.length == 1 && isError(args[0]))
                return args[0];
            return applyFunction(fn, args);
        case node instanceof ast_1.StringLiteral:
            return new object_1.StringVal(node.value);
        case node instanceof ast_1.ArrayLiteral:
            const elements = evalExpressions(node.elements, env);
            if (elements.length === 1 && isError(elements[0]))
                return elements[0];
            return new object_1.ArrayVal(elements);
        case node instanceof ast_1.IndexExpression:
            left = evaluate(node.left, env);
            if (isError(left))
                return left;
            const index = evaluate(node.index, env);
            if (isError(index))
                return index;
            return evalIndexExpression(left, index);
        default:
            return exports.primitives.NULL;
    }
}
exports.evaluate = evaluate;
function evalProgram(statements, env) {
    let result = null;
    for (const statement of statements) {
        result = evaluate(statement, env);
        switch (true) {
            case (result instanceof object_1.ReturnVal):
                return result.value;
            case (result instanceof object_1.ErrorVal):
                return result;
        }
    }
    return result;
}
exports.primitives = {
    "NULL": new object_1.NullVal(),
    "TRUE": new object_1.BooleanVal(true),
    "FALSE": new object_1.BooleanVal(false)
};
function nativeBoolToBooleanObject(input) {
    if (input)
        return exports.primitives.TRUE;
    return exports.primitives.FALSE;
}
function evalPrefixExpression(operator, right) {
    switch (operator) {
        case "!":
            return evalExclOperatorExpression(right);
        case "-":
            return evalMinusPrefixOperatorExpression(right);
        default:
            return newError("unknown operator:", operator, right === null || right === void 0 ? void 0 : right.type());
    }
}
function evalExclOperatorExpression(right) {
    const { TRUE, FALSE, NULL } = exports.primitives;
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
    if ((right === null || right === void 0 ? void 0 : right.type()) !== "INTEGER" /* Objects.Integer_Obj */) {
        return newError("unknown operator: ", right === null || right === void 0 ? void 0 : right.type());
    }
    return new object_1.IntegerVal(-right.value);
}
function evalInfixExpression(operator, left, right) {
    switch (true) {
        case (left.type() === "INTEGER" /* Objects.Integer_Obj */ && (right === null || right === void 0 ? void 0 : right.type()) === "INTEGER" /* Objects.Integer_Obj */):
            return evalIntegerInfixExpression(operator, left, right);
        case (operator == "=="):
            return nativeBoolToBooleanObject(left == right);
        case (operator == "!="):
            return nativeBoolToBooleanObject(left != right);
        case (left.type() != (right === null || right === void 0 ? void 0 : right.type())):
            return newError("type mismatch:", left.type(), operator, right === null || right === void 0 ? void 0 : right.type());
        case (left.type() === "STRING" /* Objects.String_Obj */ && (right === null || right === void 0 ? void 0 : right.type()) === "STRING" /* Objects.String_Obj */):
            return evalStringInfixExpression(operator, left, right);
        default:
            return newError("unknown operator:", left.type(), operator, right === null || right === void 0 ? void 0 : right.type());
    }
}
function evalIntegerInfixExpression(operator, left, right) {
    const leftVal = new object_1.IntegerVal(left.value).value;
    const rightVal = new object_1.IntegerVal(right.value).value;
    switch (operator) {
        case "+":
            return new object_1.IntegerVal(leftVal + rightVal);
        case "-":
            return new object_1.IntegerVal(leftVal - rightVal);
        case "*":
            return new object_1.IntegerVal(leftVal * rightVal);
        case "/":
            return new object_1.IntegerVal(leftVal / rightVal);
        case "<":
            return nativeBoolToBooleanObject(leftVal < rightVal);
        case ">":
            return nativeBoolToBooleanObject(leftVal > rightVal);
        case "==":
            return nativeBoolToBooleanObject(leftVal == rightVal);
        case "!=":
            return nativeBoolToBooleanObject(leftVal != rightVal);
        default:
            return newError("unknown operator: ", left.type(), operator, right === null || right === void 0 ? void 0 : right.type());
    }
}
function evalIfExpression(ie, env) {
    const condition = evaluate(ie === null || ie === void 0 ? void 0 : ie.condition, env);
    if (isError(condition))
        return condition;
    if (isTruthy(condition)) {
        return evaluate(ie === null || ie === void 0 ? void 0 : ie.consequence, env);
    }
    else if ((ie === null || ie === void 0 ? void 0 : ie.alternative) != null) {
        return evaluate(ie.alternative, env);
    }
    else {
        return exports.primitives.NULL;
    }
}
function isTruthy(obj) {
    const { NULL, TRUE, FALSE } = exports.primitives;
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
function newError(format, ...a) {
    const error = format.replace(/{(\d+)}/g, (match, number) => {
        return typeof a[number] !== 'undefined' ? a[number] : match;
    });
    return new object_1.ErrorVal(error);
}
exports.newError = newError;
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
    const builtin = builtins_1.builtins[node.value];
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
        case (fn instanceof object_1.FunctionVal):
            const extendedEnv = extendFunctionEnv(fn, args);
            const evaluated = evaluate(fn.body, extendedEnv);
            return unwrapReturnValue(evaluated);
        case (fn instanceof object_1.BuiltIn):
            return fn.fn(...args);
        default:
            return newError(`not a function: ${fn === null || fn === void 0 ? void 0 : fn.type()}`);
    }
}
function extendFunctionEnv(fn, args) {
    let env = new environment_1.Environment();
    if (fn === null || fn === void 0 ? void 0 : fn.parameters) {
        env = new environment_1.Environment(fn.env);
        for (let i = 0; i < fn.parameters.length; i++) {
            const param = fn.parameters[i];
            env.set(param.value, args[i]);
        }
    }
    return env;
}
function unwrapReturnValue(obj) {
    if (obj instanceof object_1.ReturnVal)
        return obj.value;
    return obj;
}
function evalStringInfixExpression(operator, left, right) {
    if (operator !== "+") {
        return newError(`unknown operator: ${left.type()} ${operator} ${right === null || right === void 0 ? void 0 : right.type()}`);
    }
    const leftVal = left.value;
    const rightVal = right.value;
    return new object_1.StringVal(leftVal + rightVal);
}
function evalIndexExpression(left, index) {
    switch (true) {
        case (left && index && left.type() === "ARRAY" /* Objects.Array_Obj */ && index.type() === "INTEGER" /* Objects.Integer_Obj */):
            return evalArrayIndexExpression(left, index);
        default:
            return newError(`index operator not supported: ${left === null || left === void 0 ? void 0 : left.type()}`);
    }
}
function evalArrayIndexExpression(array, index) {
    const arrayObject = array;
    const idx = index.value;
    const max = arrayObject.elements.length - 1;
    if (idx < 0 || idx > max)
        return exports.primitives.NULL;
    return arrayObject.elements[idx];
}
