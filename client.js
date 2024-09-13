// client.js
// const socket = new WebSocket('ws://localhost:8000');
// const socket = new WebSocket('ws://192.168.1.8:8080'); // Replace with your local IP address
const socket = new WebSocket('ws://192.168.1.24:8080'); // Use your local IP address and matching port

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const sendBtn = document.getElementById("sendBtn");
// var audio = new Audio('alert_tone.mp3');
var audio = new Audio('asests/alert_tone.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    messageContainer.append(messageElement);
    messageContainer.append(messageElement );
    if(position == 'left'){
       audio.play();
    }
};

const name = prompt("Enter your name to join");

socket.addEventListener('open', function () {
    socket.send(JSON.stringify({type: 'new-user-joined', name: name}));
});

socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    switch(data.type) {
        case 'user-joined':
            append(`${data.name} joined the chat`, 'right');
            break;
        case 'receive':
            append(`${data.name}: ${data.message}`, 'left');
            break;
        case 'left':
            append(`${data.name} left the chat`, 'left');
            break;
    }
});

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.send(JSON.stringify({type: 'send', message: message}));

    messageInput.value = '';
});
