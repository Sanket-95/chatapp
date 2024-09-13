const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // Ensure this matches the client.js port
let users = {};
let nextUserId = 1; // Start user IDs at 1

wss.on('connection', function connection(ws) {
    const userId = nextUserId++; // Assign a unique ID to each user
    console.log(`User ${userId} connected`);

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);

        switch(data.type) {
            case 'new-user-joined':
                users[userId] = data.name; // Associate the ID with the user's name
                broadcast(JSON.stringify({ type: 'user-joined', name: data.name }), ws);
                break;
            case 'send':
                broadcast(JSON.stringify({ type: 'receive', message: data.message, name: users[userId] }), ws);
                break;
        }
    });

    ws.on('close', function() {
        broadcast(JSON.stringify({ type: 'left', name: users[userId] }), ws);
        delete users[userId]; // Remove the user on disconnect
        console.log(`User ${userId} disconnected`);
    });
});

function broadcast(message, senderWs) {
    wss.clients.forEach(function each(client) {
        if (client !== senderWs && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

console.log("WebSocket server started on port 8080");
