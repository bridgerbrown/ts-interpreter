const express = require("express");
const WebSocket = require("ws");
const app = express();
const { createServer } = require("http");
const { startInterpreter } = require("../interpreter/dist/repl/repl.js");

const serverPort = process.env.PORT || 10000;

app.all('*', (req, res) => {
  res.redirect('/404');
})

const server = createServer(app);
server.listen(serverPort, () => console.log(`Websocket server listening on ${serverPort}`));
module.exports = server;

const wss = new WebSocket.Server({ port: 8000 });

wss.on('connection', (ws) => {
  console.log("Client connection received");

  ws.on('message', async (message) => {
    console.log('Received: %s', message);
    console.log('Data type: %s', typeof message);

    let data;
    try {
      data = await startInterpreter(JSON.parse(message));
    } catch (error) {
      console.error('Error parsing message:', error);
      return;
    }

    ws.send(JSON.stringify(data));
  });

})

app.get("/", (req, res) => {
  res.send("Server is live...");
});
