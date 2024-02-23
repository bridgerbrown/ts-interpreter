import { evaluate } from "../evaluator/evaluator";
import { Lexer } from "../lexer/lexer";
import { Environment } from "../object/environment";
import { Parser } from "../parser/parser";
import * as readline from 'node:readline/promises';

const prompt = '>> ';

function printParserErrors(errors: string[]): void {
  console.log(monkeyFaceAscii);
  console.log("Whoops! We ran into some monkey business here!\n");
  console.log(" parser errors:\n");
  for (const message of errors) {
    console.log(`\t${message}\n`);
  }
}
const monkeyFaceAscii = String.raw`
          __,__
  .--.  .-"    "-.  .--.
 //..\\// .-..-. \\//..\\
|||| '||//  Y   \\||'|| ||
||\\  \\\\0 | 0// // // ||
\\ '- ,\\-""""""-//, -'//
 ''-'  //  ^  ^  \\ '-''
      || \\_  _.// ||
      \\  \\'~'// //
       '._ '-=-'_.' 
          '----'
`;

export function startRepl(): void {
  const env = new Environment();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(prompt);
  rl.prompt();

  rl.on("line", (line: string) => {
    const lexer = new Lexer(line);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    if (parser.errors.length !== 0) {
      printParserErrors(parser.errors)
    } 
    const evaluated = evaluate(program, env);
    if (evaluated !== null) {
      process.stdout.write(evaluated.inspect() + '\n');
    }

    rl.prompt();
  }).on("close", () => {
    process.exit(0);
  });
}

export function startInterpreter(line: string): string {
  try {
    const env = new Environment();
    const lexer = new Lexer(line);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    const evaluated = evaluate(program, env);
    if (evaluated !== null) {
      return evaluated.inspect();
    }
    if (parser.errors.length !== 0) {
      return parserErrors(parser.errors)
    } 
  } catch (error: any) {
    return error.toString();
  }

  return "";
}

function parserErrors(errors: string[]): string {
  const messages = [];
  messages.push("Interpreter error:");
  messages.push(" parser errors:");
  for (const message of errors) {
    messages.push(`\t${message}`);
  }
  return messages.join('\n');
}
