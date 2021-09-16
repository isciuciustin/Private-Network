const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

var mysql = require('mysql');
const { url } = require('inspector');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123TGHKL$%^(*Gkckiqh}[",
    database: "db"
});

var index = {};
var users = {};
var cnt = 0;
app.get("/", (req, res) => {
    res.sendFile('index.html', { root: '../client/' });
})

app.get('/room/:url', (req, res) => {
    const url = req.params.url;
    res.sendFile('room.html', { root: '../client/' });
});
app.get('/api/:url', (req, res) => {
    var url = req.params.url;
    url = url.substr(1, url.length - 2);
    const select = "SELECT * FROM ??";
    con.query(select, url, (request, response) => {
        res.send(response);
    })

});

io.on('connection', (socket) => {
    cnt++;
    console.log(cnt + " users on");
    socket.on('disconnect', () => {
        cnt--;
        let room = users[socket.id];
        socket.to(room).broadcast.emit('leave', index[socket.id]);
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
    socket.on('chat message', (id, data, room) => {
        io.to(room).emit("chat message", id, data);
    });
    socket.on('join-room', (room, public) => {
        socket.join(room);
        const sql = "CREATE TABLE IF NOT EXISTS ?? (id int, userid varchar(250), public varchar(1000));";
        con.query(sql, [room], (req, res) => {
            const count = "SELECT MAX(id) AS max FROM ??;";
            con.query(count, room, (request, response) => {
                var counter = response[0].max + 1;
                index[socket.id] = counter;
                socket.to(room).broadcast.emit("new", counter);
                const insert = "INSERT INTO ?? (id, userid , public) VALUES(?,?,?);";
                con.query(insert, [room, counter, socket.id, public], (request, response) => {
                    console.log('Insert')
                    users[socket.id] = room;
                })
            })

        })

    })
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});