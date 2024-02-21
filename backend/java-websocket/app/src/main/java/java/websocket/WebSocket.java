package websocket.java;

import javax.websocket.OnMessage;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/socket")
public class WebSocket {

    private Session session;
    private static Set<Endpoint> endpoints
      = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session) throws IOException {
      this.session = session;
      endpoints.add(this);

      Message message = new Message();
      broadcast(message);
    }

    @OnMessage
    public void onMessage(Session session, Message message) throws IOException {
      
    }

    @OnClose
    public void onClose(Session session) throws IOException {
        // WebSocket connection closes
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        // Do error handling here
    }
}
