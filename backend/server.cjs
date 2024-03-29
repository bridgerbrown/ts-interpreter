const WebSocket = require("ws");
const express = require("express");
const { createServer } = require("http");
const { evaluate } = require("./interpreter-dist/evaluator/evaluator.js");
const { Environment } = require("./interpreter-dist/object/environment.js");
const { Lexer } = require("./interpreter-dist/lexer/lexer.js");
const { Parser } = require("./interpreter-dist/parser/parser.js");

const serverPort = process.env.PORT || 443;
const app = express();

app.use(express.static("public"));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

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
        console.log(error);
        ws.send(error.toString());
      });
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
})

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

app.get("/", (req, res) => {
  res.send("Server is live...");
});

app.all('*', (req, res) => {
  res.redirect('/404');
})

server.listen(serverPort, () => console.log(`Listening on ${serverPort}`));

function interpreter(input, env) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Interpreter process timed out after 5 seconds. Make sure you are using allowed syntax!"));
    }, 5000);

    try {
      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      if (parser === null) {
        reject(new Error("Parser returned null. Make sure you are using allowed syntax!"));
      }
      if (parser.errors.length !== 0) {
        clearTimeout(timeout);
        resolve(parserErrors(parser.errors));
        console.log(parserErrors(parser.errors));
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
      console.log(error);
      return error.toString();
    }
    return "";
  })
}

function parserErrors(errors) {
  const messages = [];
  messages.push("Parser errors:");
  for (const message of errors) {
    messages.push(`${errors.indexOf(message) + 1}) ${message}.`);
  }
  return messages.join('\r\n');
}

module.exports = server;
