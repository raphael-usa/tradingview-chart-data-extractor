// server.js

const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established.');

  // Handle messages received from the client
  ws.on('message', (message) => {
    console.log('Message received from client:', message);
    // Handle the message as needed
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Handle WebSocket close events
  ws.on('close', () => {
    console.log('WebSocket closed.');
  });
});

server.listen(4000, () => {
  console.log('WebSocket server is listening on port 4000.');
});
