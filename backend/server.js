const WebSocket = require("ws");
const express = require("express");
const app = express();
const { createServer } = require("http");
const { startRepl } = require("../interpreter/dist/repl/repl.js");
const { Environment } = require("../interpreter/dist/object/environment.js");
const { Lexer } = require("../interpreter/dist/lexer/lexer.js");
const { Parser } = require("../interpreter/dist/parser/parser.js");
const { evaluate } = require("../interpreter/dist/evaluator/evaluator.js");
const readline = require("readline");
const { Writable } = require("stream");

const serverPort = process.env.PORT || 10000;

app.all('*', (req, res) => {
  res.redirect('/404');
})

const server = createServer(app);
server.listen(serverPort, () => console.log(`Listening on ${serverPort}`));
module.exports = server;

const wss = new WebSocket.Server({ port: 8000 });

wss.on('connection', (ws) => {
  console.log("Client connection received");
  const env = new Environment();

  const wsStream = new Writable({
    write(chunk, encoding, callback) {
      ws.send(chunk.toString());
      callback();
    }
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: wsStream
  });
  rl.prompt();

  ws.on('message', (message) => {
    rl.write(message);
  });

  rl.on("line", (line) => {
    const lexer = new Lexer(line);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    if (parser.errors.length !== 0) {
      printParserErrors(parser.errors)
      rl.prompt();
      return;
    } 
    const evaluated = evaluate(program, env);

    if (evaluated !== null) {
      ws.send(JSON.stringify(evaluated.inspect() + '\n'));
    } else {
      ws.send(JSON.stringify(""));
    }
    rl.prompt();
  })
});

app.get("/", (req, res) => {
  res.send("Server is live...");
});
