const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var users = {};
var cnt = 0;
app.get("/", (req, res) => {
    res.sendFile('index.html', { root: '../client/' });
})

app.get('/room/:url', (req, res) => {
    const url = req.params.url;
    res.sendFile('room.html', { root: '../client/' });
});

io.on('connection', (socket) => {
    cnt++;
    users[socket.id] = socket;
    console.log(cnt + " users on" + socket.id);
    socket.on('disconnect', () => {
        cnt--;
        console.log(cnt + " users remained");
    });
})
io.on('connection', (socket) => {
    socket.on('chat message', (msg, room) => {

        io.to(room).emit("chat message", `{${msg}}`);
    });
    socket.on('join-room', (room) => {
        socket.join(room);
    })
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});