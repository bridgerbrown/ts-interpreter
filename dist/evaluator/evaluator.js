"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
var ast_1 = require("../ast/ast");
var object_1 = require("../object/object");
function evaluate(node) {
    switch (true) {
        case node instanceof ast_1.Program:
            return evalStatements(node.statements);
        case node instanceof ast_1.ExpressionStatement:
            return evaluate(node.expression);
        case node instanceof ast_1.IntegerLiteral:
            return new object_1.IntegerVal(node.value);
        case node instanceof ast_1.Boolean:
            return new object_1.BooleanVal(node.value);
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
