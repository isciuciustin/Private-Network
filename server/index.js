const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const NodeRSA = require('node-rsa');
const cors = require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123TGHKL$%^(*Gkckiqh}[",
    database: "db"
});


var users = {};
var cnt = 0;
var url = ""
app.get("/", (req, res) => {
    res.sendFile('index.html', { root: '../client/' });
})

app.get('/room/:url', (req, res) => {
    const url = req.params.url;
    res.sendFile('room.html', { root: '../client/' });
});
app.get('/api', (req, res) => {
    res.send('text');
});

io.on('connection', (socket) => {
    cnt++;
    console.log(cnt + " users on");
    socket.on('disconnect', () => {
        cnt--;
        let room = users[socket.id];
        const count = "SELECT * FROM ??";
        con.query(count, room, (request, response) => {
            if (response) {
                let counter = response.length;
                if (counter == 1) {
                    const del = "DROP TABLE ??";
                    con.query(del, room, (req, res) => {
                        console.log('DELETE ROOM!')
                    })
                }
                else {
                    const del = "DELETE FROM ?? WHERE userid = ?";
                    con.query(del, [room, socket.id], (req, res) => {
                        console.log('DELETE!')
                    })
                }
            }
        })
        console.log(cnt + " users remained");
    });
})
io.on('connection', (socket) => {
    socket.on('chat message', (msg, room) => {

        io.to(room).emit("chat message", `{${msg}}`);
    });
    socket.on('join-room', (room) => {
        socket.join(room);
        const key = new NodeRSA({ b: 512 });
        const private = key.exportKey('private');
        const public = key.exportKey('public');
        const sql = "CREATE TABLE IF NOT EXISTS ?? (ind int, userid varchar(250),public varchar(500));";
        con.query(sql, [room], (req, res) => {
            const count = "SELECT * FROM ??";
            con.query(count, room, (request, response) => {
                let counter = response.length + 1;
                const insert = "INSERT INTO ?? (ind, userid , public) VALUES(?,?,?)";
                con.query(insert, [room, counter, socket.id, public], (request, response) => {
                    console.log('Insert')
                    users[socket.id] = room;
                })
            })

        })
        io.to(room).emit("private", private);
    })
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});