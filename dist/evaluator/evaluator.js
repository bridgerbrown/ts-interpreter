"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
var ast_1 = require("../ast/ast");
var object_1 = require("../object/object");
function evaluate(node, env) {
    var right;
    var left;
    var val;
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
        case node instanceof ast_1.Identifier:
            return evalIdentifier(node, env);
        default:
            return primitives.NULL;
    }
}
exports.evaluate = evaluate;
function evalProgram(statements, env) {
    var result = null;
    for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
        var statement = statements_1[_i];
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
var primitives = {
    "NULL": new object_1.NullVal(),
    "TRUE": new object_1.BooleanVal(true),
    "FALSE": new object_1.BooleanVal(false)
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
            return newError("unknown operator:", operator, right === null || right === void 0 ? void 0 : right.type());
    }
}
function evalExclOperatorExpression(right) {
    var TRUE = primitives.TRUE, FALSE = primitives.FALSE, NULL = primitives.NULL;
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
        default:
            return newError("unknown operator:", left.type(), operator, right === null || right === void 0 ? void 0 : right.type());
    }
}
function evalIntegerInfixExpression(operator, left, right) {
    var leftVal = new object_1.IntegerVal(left.value).value;
    var rightVal = new object_1.IntegerVal(right.value).value;
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
    var condition = evaluate(ie === null || ie === void 0 ? void 0 : ie.condition, env);
    if (isError(condition))
        return condition;
    if (isTruthy(condition)) {
        return evaluate(ie === null || ie === void 0 ? void 0 : ie.consequence, env);
    }
    else if ((ie === null || ie === void 0 ? void 0 : ie.alternative) != null) {
        return evaluate(ie.alternative, env);
    }
    else {
        return primitives.NULL;
    }
}
function isTruthy(obj) {
    var NULL = primitives.NULL, TRUE = primitives.TRUE, FALSE = primitives.FALSE;
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
    var result = null;
    if (block && block.statements) {
        for (var _i = 0, _a = block.statements; _i < _a.length; _i++) {
            var statement = _a[_i];
            result = evaluate(statement, env);
            if (result !== null) {
                var rt = result.type();
                if (rt == "RETURN_VALUE" /* Objects.Return_Value_Obj */ || rt == "ERROR" /* Objects.Error_Obj */) {
                    return result;
                }
            }
        }
    }
    return result;
}
function newError(format) {
    var a = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        a[_i - 1] = arguments[_i];
    }
    var error = format.replace(/{(\d+)}/g, function (match, number) {
        return typeof a[number] !== 'undefined' ? a[number] : match;
    });
    return new object_1.ErrorVal(error);
}
function isError(obj) {
    if (obj !== null) {
        return obj.type() == "ERROR" /* Objects.Error_Obj */;
    }
    return false;
}
function evalIdentifier(node, env) {
    var val = env.get(node.name.value);
    if (!val)
        return newError("identifier not found: " + (node === null || node === void 0 ? void 0 : node.name.value));
    return val;
}
