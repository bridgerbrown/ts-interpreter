"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startInterpreter = exports.startRepl = void 0;
var evaluator_1 = require("../evaluator/evaluator");
var lexer_1 = require("../lexer/lexer");
var environment_1 = require("../object/environment");
var parser_1 = require("../parser/parser");
var readline = require("node:readline/promises");
var prompt = '>> ';
function printParserErrors(errors) {
    console.log(monkeyFaceAscii);
    console.log("Whoops! We ran into some monkey business here!\n");
    console.log(" parser errors:\n");
    for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
        var message = errors_1[_i];
        console.log("\t".concat(message, "\n"));
    }
}
var monkeyFaceAscii = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n          __,__\n  .--.  .-\"    \"-.  .--.\n //..\\// .-..-. \\//..\\\n|||| '||//  Y   \\||'|| ||\n||\\  \\\\0 | 0// // // ||\n\\ '- ,\\-\"\"\"\"\"\"-//, -'//\n ''-'  //  ^  ^  \\ '-''\n      || \\_  _.// ||\n      \\  \\'~'// //\n       '._ '-=-'_.' \n          '----'\n"], ["\n          __,__\n  .--.  .-\"    \"-.  .--.\n //..\\\\// .-..-. \\\\//..\\\\\n|||| '||//  Y   \\\\||'|| ||\n||\\\\  \\\\\\\\0 | 0// // // ||\n\\\\ '- ,\\\\-\"\"\"\"\"\"-//, -'//\n ''-'  //  ^  ^  \\\\ '-''\n      || \\\\_  _.// ||\n      \\\\  \\\\'~'// //\n       '._ '-=-'_.' \n          '----'\n"])));
function startRepl() {
    var env = new environment_1.Environment();
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt(prompt);
    rl.prompt();
    rl.on("line", function (line) {
        var lexer = new lexer_1.Lexer(line);
        var parser = new parser_1.Parser(lexer);
        var program = parser.parseProgram();
        if (parser.errors.length !== 0) {
            printParserErrors(parser.errors);
        }
        var evaluated = (0, evaluator_1.evaluate)(program, env);
        if (evaluated !== null) {
            process.stdout.write(evaluated.inspect() + '\n');
        }
        rl.prompt();
    }).on("close", function () {
        process.exit(0);
    });
}
exports.startRepl = startRepl;
function startInterpreter(line) {
    var env = new environment_1.Environment();
    var lexer = new lexer_1.Lexer(line);
    var parser = new parser_1.Parser(lexer);
    var program = parser.parseProgram();
    if (parser.errors.length !== 0) {
        printParserErrors(parser.errors);
    }
    var evaluated = (0, evaluator_1.evaluate)(program, env);
    if (evaluated !== null) {
        return evaluated.inspect();
    }
    return "";
}
exports.startInterpreter = startInterpreter;
var templateObject_1;
