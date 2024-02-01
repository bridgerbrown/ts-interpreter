import { Lexer } from "../lexer/lexer";
import { Parser } from "../parser/parser";
import * as readline from 'node:readline/promises';

const prompt = '>> ';

function printParserErrors(errors: string[]): void {
  for (const message of errors) {
    console.log(`\t${message}`);
  }
}

export function start(): void {
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
    } else {
      console.log(program.string());
    }

    rl.prompt();
  }).on("close", () => {
    process.exit(0);
  });
}
