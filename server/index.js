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

app.get('/:url', (req, res) => {
    const url = req.params.url;
    console.log(url);
    res.sendFile('room.html', { root: '../client/' });
    io.on('connection', (socket) => {
        console.log('a user connected');
        cnt++;
        users[socket.id] = cnt;
        socket.on('disconnect', () => {
            cnt--;
            console.log('user disconnected');
        });
    });
    io.on('connection', (socket) => {
        socket.on('private message', (anotherSocketId, msg)=> {
            console.log(url + " " + msg);
            socket.to(anotherSocketId).emit("private message", socket.id, msg);
        });
    });
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});