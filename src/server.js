const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const Filter = require("bad-words");
const format = require("date-format");
const {
    getListUser,
    addUser,
    removeUser,
    findUser,
} = require("./views/js/user");
const viewPath = path.join(__dirname, "./views");
const socketio = require("socket.io");

require("dotenv").config();

app.use(express.static(viewPath));

const server = http.createServer(app);
const io = socketio(server);

let count = 1;
let messages = "Chao moi nguoi";

createMessage = (mes, username) => {
    return {
        mes,
        username,
        createAt: format("dd/MM/yyyy hh:mm:ss", new Date()),
    };
};
io.on("connection", (socket) => {
    socket.on("join room from client", ({ room, username }) => {
        socket.join(room);
        //chao ngươi dung moi nguoi
        //Gửi cho client mới tham gia
        socket.emit(
            "send mes from server",
            createMessage(`Chào mừng bạn đã đến với phòng ${room}`, "Admin")
        );

        //Gửi cho các client còn lại
        //broadcast Gửi cho all client trừ người tương tác
        socket.broadcast
            .to(room)
            .emit(
                "send mes from server",
                createMessage(
                    `${username} mới tham gia vào phòng ${room}`,
                    "Admin"
                )
            );

        //chat
        socket.on("send mes from client", (mes, callback) => {
            const filter = new Filter();
            if (filter.isProfane(mes)) {
                return callback("tin nhan khong hop le");
            }

            const user = findUser(socket.id);
            io.to(room).emit(
                "send mes from server",
                createMessage(mes, user.username)
            );
            callback();
        });

        //location
        socket.on("send location from client", (latitude, longitude) => {
            const location = `https://www.google.com/maps?q=${latitude},${longitude}`;
            const user = findUser(socket.id);
            io.to(room).emit(
                "send location from server",
                createMessage(location, user.username)
            );
        });

        //list User
        const newUser = {
            id: socket.id,
            username,
            room,
        };

        addUser(newUser);
        io.to(room).emit("send list user from server", getListUser(room));

        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.to(room).emit("send list user from server", getListUser(room));
            console.log("disconnet");
        });
    });

    //basic về socket io
    // socket.on("increment", () => {
    //     count++;
    //     io.emit("send count", count);
    // });

    //socket.emit : chi gui du lieu cho moi client no tuong tac
    //io.emit :  gui du lieu cho  ALL  client
    // //truyen count tu server ve client
    // socket.emit("send count", count);

    //disconnect client
});

let port = process.env.PORT || 6969;

server.listen(port, () => {
    console.log("Backend Nodejs is runing on the port : " + port);
});
