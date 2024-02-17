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
class LetStatement {
    constructor(token, name, value) {
        this.token = token;
        this.name = name;
        this.value = value;
    }
    statementNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        let out = `let ${this.name?.value} = ${this.value?.string()};`;
        return out;
    }
}
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
class PrefixExpression {
    constructor(token, operator, right) {
        this.token = token;
        this.operator = operator;
        this.right = right;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        return `(${this.operator}${this.right?.string()})`;
    }
}
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
        return `(${this.left.string()} ${this.operator} ${this.right?.string()})`;
    }
}
class Boolean {
    constructor(token, value) {
        this.token = token;
        this.value = value;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() { return this.token.literal; }
}
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
        let expression = "if" + this.condition?.string() + " " + this.consequence?.string();
        if (this.alternative !== null) {
            expression += "else " + this.alternative?.string();
        }
        return expression;
    }
}
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
                args.push(arg?.string());
            }
            return this.fn.string() + "(" + this.args.join(", ") + ")";
        }
        return "";
    }
}
class StringLiteral {
    constructor(token, value) {
        this.token = token;
        this.value = value;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() { return this.token.literal; }
}
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
class IndexExpression {
    constructor(token, left, index) {
        this.token = token;
        this.left = left;
        this.index = index;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        return "(" + this.left.string() + "[" + this.index?.string() + "]";
    }
}
class HashLiteral {
    constructor(token, pairs) {
        this.token = token;
        this.pairs = pairs;
    }
    expressionNode() { }
    tokenLiteral() { return this.token.literal; }
    string() {
        const pairs = [];
        for (let [key, value] of this.pairs) {
            pairs.push(`${key.string()}:${value?.string()}`);
        }
        return "{" + pairs.join(", ") + "}";
    }
}
export { Program, LetStatement, ReturnStatement, Identifier, IntegerLiteral, ExpressionStatement, PrefixExpression, InfixExpression, Boolean, IfExpression, BlockStatement, FunctionLiteral, CallExpression, StringLiteral, ArrayLiteral, IndexExpression, HashLiteral };
