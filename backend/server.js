const WebSocket = require("ws");
const express = require("express");
const app = express();
const { createServer } = require("http");
const { Environment } = require("../interpreter/dist/object/environment.js");
const { Lexer } = require("../interpreter/dist/lexer/lexer.js");
const { Parser } = require("../interpreter/dist/parser/parser.js");
const { evaluate } = require("../interpreter/dist/evaluator/evaluator.js");
const { spawn } = require('child_process');

const serverPort = process.env.PORT || 10000;

app.all('*', (req, res) => {
  res.redirect('/404');
})

const server = createServer(app);
server.listen(serverPort, () => console.log(`Listening on ${serverPort}`));
module.exports = server;

const wss = new WebSocket.Server({ port: 8000 });

function createREPL(env) {
  const repl = spawn('node', [], { stdio: ['pipe', 'pipe', 'pipe'] });
  const rl = repl.stdin;

  repl.on('close', (code, signal) => {
    console.log(`REPL closed with code ${code} and signal ${signal}`);
  })

  repl.stdin.on("data", (data) => {
    console.log("repl stdin", data.toString());
    const lexer = new Lexer(data);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    if (parser.errors.length !== 0) {
      printParserErrors(parser.errors);
    } 

    const evaluated = evaluate(program, env);
    if (evaluated !== null) {
      const output = evaluated.inspect() + '\n';
      ws.send(output);
    }
  })

  repl.stderr.on('data', (data) => {
    console.error(`REPL Error: ${data}`);
  });

  return rl;
}

wss.on('connection', (ws) => {
  console.log("Client connection received");
  const env = new Environment();
  const rl = createREPL(env);

  ws.on('message', (message) => {
    console.log('Received:', JSON.parse(message));
    rl.write(JSON.parse(message) + '\n');
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    rl.kill();
  });
})

app.get("/", (req, res) => {
  res.send("Server is live...");
});
