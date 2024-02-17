"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newError = exports.primitives = exports.evaluate = void 0;
var ast_1 = require("../ast/ast");
var object_1 = require("../object/object");
var environment_1 = require("../object/environment");
var builtins_1 = require("./builtins");
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
            return val;
        case node instanceof ast_1.Identifier:
            return evalIdentifier(node, env);
        case node instanceof ast_1.FunctionLiteral:
            var params = node.parameters;
            var body = node.body;
            return new object_1.FunctionVal(params, body, env);
        case node instanceof ast_1.CallExpression:
            var fn = evaluate(node.fn, env);
            if (isError(fn))
                return fn;
            var args = evalExpressions(node.args, env);
            if (args.length == 1 && isError(args[0]))
                return args[0];
            return applyFunction(fn, args);
        case node instanceof ast_1.StringLiteral:
            return new object_1.StringVal(node.value);
        case node instanceof ast_1.ArrayLiteral:
            var elements = evalExpressions(node.elements, env);
            if (elements.length === 1 && isError(elements[0]))
                return elements[0];
            return new object_1.ArrayVal(elements);
        case node instanceof ast_1.IndexExpression:
            left = evaluate(node.left, env);
            if (isError(left))
                return left;
            var index = evaluate(node.index, env);
            if (isError(index))
                return index;
            return evalIndexExpression(left, index);
        case node instanceof ast_1.HashLiteral:
            return evalHashLiteral(node, env);
        default:
            return exports.primitives.NULL;
    }
}
exports.evaluate = evaluate;
function evalProgram(statements, env) {
    var e_1, _a;
    var result = null;
    try {
        for (var statements_1 = __values(statements), statements_1_1 = statements_1.next(); !statements_1_1.done; statements_1_1 = statements_1.next()) {
            var statement = statements_1_1.value;
            result = evaluate(statement, env);
            switch (true) {
                case (result instanceof object_1.ReturnVal):
                    return result.value;
                case (result instanceof object_1.ErrorVal):
                    return result;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (statements_1_1 && !statements_1_1.done && (_a = statements_1.return)) _a.call(statements_1);
        }
        finally { if (e_1) throw e_1.error; }
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
    var TRUE = exports.primitives.TRUE, FALSE = exports.primitives.FALSE, NULL = exports.primitives.NULL;
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
        return exports.primitives.NULL;
    }
}
function isTruthy(obj) {
    var NULL = exports.primitives.NULL, TRUE = exports.primitives.TRUE, FALSE = exports.primitives.FALSE;
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
    var e_2, _a;
    var result = null;
    if (block && block.statements) {
        try {
            for (var _b = __values(block.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var statement = _c.value;
                result = evaluate(statement, env);
                if (result !== null) {
                    var rt = result.type();
                    if (rt == "RETURN_VALUE" /* Objects.Return_Value_Obj */ || rt == "ERROR" /* Objects.Error_Obj */) {
                        return result;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
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
exports.newError = newError;
function isError(obj) {
    if (obj !== null) {
        return obj.type() == "ERROR" /* Objects.Error_Obj */;
    }
    return false;
}
function evalIdentifier(node, env) {
    var val = env.get(node.value);
    if (val)
        return val;
    var builtin = builtins_1.builtins[node.value];
    if (builtin)
        return builtin;
    return newError("identifier not found: " + node.value);
}
function evalExpressions(exps, env) {
    var e_3, _a;
    var result = [];
    if (exps) {
        try {
            for (var exps_1 = __values(exps), exps_1_1 = exps_1.next(); !exps_1_1.done; exps_1_1 = exps_1.next()) {
                var e = exps_1_1.value;
                var evaluated = evaluate(e, env);
                if (isError(evaluated))
                    return [evaluated];
                result.push(evaluated);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (exps_1_1 && !exps_1_1.done && (_a = exps_1.return)) _a.call(exps_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    return result;
}
function applyFunction(fn, args) {
    var _a;
    switch (true) {
        case (fn instanceof object_1.FunctionVal):
            var extendedEnv = extendFunctionEnv(fn, args);
            var evaluated = evaluate(fn.body, extendedEnv);
            return unwrapReturnValue(evaluated);
        case (fn instanceof object_1.BuiltIn):
            return (_a = fn).fn.apply(_a, __spreadArray([], __read(args), false));
        default:
            return newError("not a function: ".concat(fn === null || fn === void 0 ? void 0 : fn.type()));
    }
}
function extendFunctionEnv(fn, args) {
    var env = new environment_1.Environment();
    if (fn === null || fn === void 0 ? void 0 : fn.parameters) {
        env = new environment_1.Environment(fn.env);
        for (var i = 0; i < fn.parameters.length; i++) {
            var param = fn.parameters[i];
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
        return newError("unknown operator: ".concat(left.type(), " ").concat(operator, " ").concat(right === null || right === void 0 ? void 0 : right.type()));
    }
    var leftVal = left.value;
    var rightVal = right.value;
    return new object_1.StringVal(leftVal + rightVal);
}
function evalIndexExpression(left, index) {
    switch (true) {
        case (left && index && left.type() === "ARRAY" /* Objects.Array_Obj */ && index.type() === "INTEGER" /* Objects.Integer_Obj */):
            return evalArrayIndexExpression(left, index);
        default:
            return newError("index operator not supported: ".concat(left === null || left === void 0 ? void 0 : left.type()));
    }
}
function evalArrayIndexExpression(array, index) {
    var arrayObject = array;
    var idx = index.value;
    var max = arrayObject.elements.length - 1;
    if (idx < 0 || idx > max)
        return exports.primitives.NULL;
    return arrayObject.elements[idx];
}
function evalHashLiteral(node, env) {
    var e_4, _a;
    var pairs = new Map();
    try {
        for (var _b = __values(node === null || node === void 0 ? void 0 : node.pairs), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), keyNode = _d[0], valueNode = _d[1];
            var key = evaluate(keyNode, env);
            if (isError(key))
                return key;
            var hashKey = key;
            if (!hashKey)
                return newError("unusable as hash key: ".concat(key === null || key === void 0 ? void 0 : key.type()));
            var value = evaluate(valueNode, env);
            if (isError(value))
                return value;
            var hashed = hashKey.hashKey();
            pairs.set(hashed, new object_1.HashPair(key, value));
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return new object_1.HashVal(pairs);
}
