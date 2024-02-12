"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
var ast_1 = require("../ast/ast");
var object_1 = require("../object/object");
function evaluate(node) {
    var right;
    var left;
    switch (true) {
        case node instanceof ast_1.Program:
            return evalStatements(node.statements);
        case node instanceof ast_1.ExpressionStatement:
            return evaluate(node.expression);
        case node instanceof ast_1.IntegerLiteral:
            return new object_1.IntegerVal(node.value);
        case node instanceof ast_1.Boolean:
            return nativeBoolToBooleanObject(node.value);
        case node instanceof ast_1.PrefixExpression:
            right = evaluate(node.right);
            return evalPrefixExpression(node.operator, right);
        case node instanceof ast_1.InfixExpression:
            left = evaluate(node.left);
            right = evaluate(node.right);
            return evalInfixExpression(node.operator, left, right);
        default:
            return null;
    }
}
exports.evaluate = evaluate;
function evalStatements(statements) {
    var result = null;
    for (var _i = 0, statements_1 = statements; _i < statements_1.length; _i++) {
        var statement = statements_1[_i];
        result = evaluate(statement);
        return result;
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
            return primitives.NULL;
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
    if ((right === null || right === void 0 ? void 0 : right.type()) !== "INTEGER" /* Objects.Integer_Obj */)
        return primitives.NULL;
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
        default:
            return primitives.NULL;
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
            return primitives.NULL;
    }
}
