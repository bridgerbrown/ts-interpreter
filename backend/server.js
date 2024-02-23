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

wss.on('connection', (ws) => {
  console.log("Client connection received");
  const env = new Environment();

  ws.on('message', (message) => {
    console.log('Received:', JSON.parse(message));
    const input = JSON.parse(message);
    interpreter(input, env)
      .then((output) => {
        ws.send(output);
      })
      .catch((error) => {
        ws.send(error.toString());
      });
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
})

app.get("/", (req, res) => {
  res.send("Server is live...");
});

function interpreter(input, env) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Interpreter process timed out after 5 seconds. Make sure you are using allowed syntax!"));
    }, 5000);

    try {
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      if (parser.errors.length !== 0) {
        clearTimeout(timeout);
        resolve(parserErrors(parser.errors));
      } 

      const evaluated = evaluate(program, env);
      if (evaluated !== null) {
        clearTimeout(timeout);
        resolve(evaluated.inspect());
      } else {
        reject(new Error("Evaluator returned null. Make sure you are using allowed syntax!"));
      }
    } catch (error) {
      clearTimeout(timeout);
      return error.toString();
    }
    return "";
  })
}
