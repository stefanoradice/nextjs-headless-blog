import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('Nuovo client connesso');

  ws.on('message', (message) => {
    const text = message.toString();
    console.log('Messaggio ricevuto:', text);

    // Inoltra il messaggio a tutti i client tranne chi l'ha inviato
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    });
  });

  ws.on('close', () => console.log('Client disconnesso'));
});

export default wss;
