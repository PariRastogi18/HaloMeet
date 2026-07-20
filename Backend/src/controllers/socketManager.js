import { Server } from "socket.io";

const connections = {};
const socketToRoom = {};
const messages = {};
const timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Something connected", socket.id);
    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      socketToRoom[socket.id] = path;
      timeOnline[socket.id] = new Date();

      for (let index = 0; index < connections[path].length; index++) {
        io.to(connections[path][index]).emit(
          "user-joined",
          socket.id,
          connections[path],
        );
      }

      if (messages[path] !== undefined) {
        for (let index = 0; index < messages[path].length; index++) {
          io.to(socket.id).emit(
            "chat-msg",
            messages[path][index]["data"],
            messages[path][index]["sender"],
            messages[path][index]["socket-id-sender"],
          );
        }
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-msg", (data, sender) => {
      const matchingRoom = socketToRoom[socket.id];

      if (!matchingRoom) {
        return;
      }
      if (!messages[matchingRoom]) {
        messages[matchingRoom] = [];
      }

      messages[matchingRoom].push({
        sender,
        data,
        "socket-id-sender": socket.id,
      });

      console.log("message:", matchingRoom, ":", sender, data);

      connections[matchingRoom].forEach((element) => {
        io.to(element).emit("chat-msg", data, sender, socket.id);
      });
    });

    socket.on("disconnect", () => {
      const diffTime = Math.abs(timeOnline[socket.id] - new Date());

      const room = socketToRoom[socket.id];
      if (!room || !connections[room]) {
        return;
      }

      for (const id of connections[room]) {
        if (id !== socket.id) {
          io.to(id).emit("user-left", socket.id, diffTime);
        }
      }

      const index = connections[room].indexOf(socket.id);
      if (index !== -1) {
        connections[room].splice(index, 1);
      }

      delete socketToRoom[socket.id];
      delete timeOnline[socket.id];

      if (connections[room].length === 0) {
        delete connections[room];
      }
    });
  });
  return io;
};
