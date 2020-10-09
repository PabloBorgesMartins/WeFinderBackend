import express from "express";
import cors from "cors";
import routes from "./routes";

const PORT = 3333;

require("dotenv-safe").config();
var jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/", (request, response) => {
  return response.json({ message: "Hello World" });
});

////////////////////////////SOCKETIO////////////////////////
/*Database*/
import { Request, Response } from "express";
import knex from "./database/connection";
import * as Yup from "yup";
/*Database*/

import http from "http";
import socketIO from "socket.io";
const formatMessage = require("../utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");

const server = http.createServer(app);

const io = socketIO(server);

const botName = "BOT SHACALMAN";

io.on("connect", (socket) => {
  //Executado ao usuário entrar no chat
  socket.on("joinRoom", (username, room) => {
    console.log(`Usuario ${username} conectado à sala ${room}`);

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Bem vindo usuario atual
    socket.emit("message", formatMessage(botName, "Bem vindo ao ChatCord!"));

    //Broadcas when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} se conectou ao chat!`)
      );

    //Enviar informacoes de sala e usuario
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(
      `A mensagem recebida foi essa = ${msg} username=${user.username} id=${user.id} room=${user.room}`
    );
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    console.log(`Usuario ${user.username} se desconectou`);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} se desconectou!`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
//////////////////////////////////////

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
