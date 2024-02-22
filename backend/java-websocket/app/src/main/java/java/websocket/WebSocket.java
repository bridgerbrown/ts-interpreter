package websocket.java;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.logging.Logger;

@ServerEndpoint("/socket")
public class WebSocket {

    private static final Logger logger = Logger.getLogger(WebSocket.class.getName());

    private Session session;
    private static Set<WebSocket> endpoints = new CopyOnWriteArraySet<>();
    private Process interpreterProcess;

    @OnOpen
    public void onOpen(Session session) throws IOException {
      this.session = session;
      endpoints.add(this);
      startInterpreter();
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException, InterruptedException {
      String output = executeCommand(message); 
      
      for (WebSocket endpoint : endpoints) {
        synchronized (endpoint) {
          endpoint.session.getBasicRemote().sendText(output);
        }
      }
    }

    @OnClose
    public void onClose() {
      endpoints.remove(this);
      interpreterProcess.destroy();
    }

    @OnError
    public void onError(Throwable throwable) {
      logger.severe("WebSocket error: " + throwable.getMessage());
    }

    private void startInterpreter() throws IOException {
      try {
        ProcessBuilder processBuilder = new ProcessBuilder("node", "../../../../../../../../interpreter/main.ts");
        interpreterProcess = processBuilder.start();
      } catch (IOException e) {
        logger.severe("Error starting interpreter: " + e.getMessage());
        throw e;
      }
    }

    private String executeCommand(String command) throws IOException, InterruptedException {
      OutputStream outputStream = interpreterProcess.getOutputStream();
      outputStream.write(command.getBytes());
      outputStream.flush();

      BufferedReader reader = new BufferedReader(new InputStreamReader(interpreterProcess.getInputStream()));
      StringBuilder output = new StringBuilder();
      String line;
      while ((line = reader.readLine()) != null) {
        output.append(line).append("\n");
      }

      return output.toString();
    }
}
