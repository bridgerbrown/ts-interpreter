"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexExpression = exports.ArrayLiteral = exports.StringLiteral = exports.CallExpression = exports.FunctionLiteral = exports.BlockStatement = exports.IfExpression = exports.Boolean = exports.InfixExpression = exports.PrefixExpression = exports.ExpressionStatement = exports.IntegerLiteral = exports.Identifier = exports.ReturnStatement = exports.LetStatement = exports.Program = void 0;
class Program {
    constructor() {
        this.statements = [];
        this.statements = [];
    }
    tokenLiteral() {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        }
        else {
            return "";
        }
    }
    string() {
        let out = "";
        for (const s of this.statements) {
            out += s.string();
        }
        return out;
    }
}
exports.Program = Program;
class LetStatement {
    constructor(token, name, value) {
        this.token = token;
        this.name = name;
        this.value = value;
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        var _a, _b;
        let out = `let ${(_a = this.name) === null || _a === void 0 ? void 0 : _a.value} = ${(_b = this.value) === null || _b === void 0 ? void 0 : _b.string()};`;
        return out;
    }
}
exports.LetStatement = LetStatement;
class ReturnStatement {
    constructor(token, value) {
        this.token = token;
        this.returnValue = value;
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        let out = "";
        out += this.tokenLiteral() + " ";
        if (this.returnValue !== null) {
            out += this.returnValue.toString();
        }
        out += ";";
        return out;
    }
}
exports.ReturnStatement = ReturnStatement;
class Identifier {
    constructor(token) {
        this.value = "";
        this.token = token;
        this.value = token.literal;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() { return this.value.toString(); }
}
exports.Identifier = Identifier;
class IntegerLiteral {
    constructor(token, value) {
        this.token = token;
        this.value = value;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        if (this.value) {
            return this.value.toString();
        }
        else {
            return "";
        }
    }
}
exports.IntegerLiteral = IntegerLiteral;
class ExpressionStatement {
    constructor(token, expression) {
        this.token = token;
        this.expression = expression;
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        if (this.expression !== null) {
            return `${this.expression.string()}`;
        }
        return "";
    }
}
exports.ExpressionStatement = ExpressionStatement;
class PrefixExpression {
    constructor(token, operator, right) {
        this.token = token;
        this.operator = operator;
        this.right = right;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        var _a;
        return `(${this.operator}${(_a = this.right) === null || _a === void 0 ? void 0 : _a.string()})`;
    }
}
exports.PrefixExpression = PrefixExpression;
class InfixExpression {
    constructor(token, operator, left, right) {
        this.token = token;
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        var _a;
        return `(${this.left.string()} ${this.operator} ${(_a = this.right) === null || _a === void 0 ? void 0 : _a.string()})`;
    }
}
exports.InfixExpression = InfixExpression;
class Boolean {
    constructor(token, value) {
        this.token = token;
        this.value = value;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() { return this.token.literal; }
}
exports.Boolean = Boolean;
class IfExpression {
    constructor(token, condition, consequence, alternative) {
        this.token = token;
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        var _a, _b, _c;
        let expression = "if" + ((_a = this.condition) === null || _a === void 0 ? void 0 : _a.string()) + " " + ((_b = this.consequence) === null || _b === void 0 ? void 0 : _b.string());
        if (this.alternative !== null) {
            expression += "else " + ((_c = this.alternative) === null || _c === void 0 ? void 0 : _c.string());
        }
        return expression;
    }
}
exports.IfExpression = IfExpression;
class BlockStatement {
    constructor(token, statements) {
        this.token = token;
        this.statements = statements;
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        let statements = "";
        for (let s of this.statements) {
            statements += s.string();
        }
        return statements;
    }
}
exports.BlockStatement = BlockStatement;
class FunctionLiteral {
    constructor(token, parameters, body) {
        this.token = token;
        this.parameters = parameters;
        this.body = body;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        let params = [];
        if (this.parameters) {
            for (const p of this.parameters) {
                params.push(p.string());
            }
        }
        let body = "";
        if (this.body) {
            body = this.body.toString();
        }
        let str = this.tokenLiteral() + "(" + params.join(", ") + ") " + body;
        return str;
    }
}
exports.FunctionLiteral = FunctionLiteral;
class CallExpression {
    constructor(token, fn, args) {
        this.token = token;
        this.fn = fn;
        this.args = args;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        let args = [];
        if (this.args) {
            for (let arg of this.args) {
                args.push(arg === null || arg === void 0 ? void 0 : arg.string());
            }
            return this.fn.string() + "(" + this.args.join(", ") + ")";
        }
        return "";
    }
}
exports.CallExpression = CallExpression;
class StringLiteral {
    constructor(token, value) {
        this.token = token;
        this.value = value;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() { return this.token.literal; }
}
exports.StringLiteral = StringLiteral;
class ArrayLiteral {
    constructor(token, elements) {
        this.token = token;
        this.elements = elements;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        let arr = [];
        if (this.elements) {
            for (let el of this.elements) {
                el ? arr.push(el.string()) : "null";
            }
            return "[" + arr.join(", ") + "]";
        }
        return "[]";
    }
}
exports.ArrayLiteral = ArrayLiteral;
class IndexExpression {
    constructor(token, left, index) {
        this.token = token;
        this.left = left;
        this.index = index;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        var _a;
        return "(" + this.left.string() + "[" + ((_a = this.index) === null || _a === void 0 ? void 0 : _a.string()) + "]";
    }
}
exports.IndexExpression = IndexExpression;
