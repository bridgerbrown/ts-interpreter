"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var lexer_1 = require("../lexer/lexer");
var parser_1 = require("../parser/parser");
var readline = require("node:readline/promises");
var prompt = '>> ';
function printParserErrors(errors) {
    for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
        var message = errors_1[_i];
        console.log("\t".concat(message));
    }
}
function start() {
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
        else {
            console.log(program.string());
        }
        rl.prompt();
    }).on("close", function () {
        process.exit(0);
    });
}
exports.start = start;
