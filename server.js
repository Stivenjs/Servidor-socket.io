const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());

app.get("/status", (req, res) => {
  res.json({ message: "Servidor en funcionamiento" });
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userStatus = {}; // Para rastrear el estado de conexión de los usuarios

io.of("/live-chat").on("connection", (socket) => {
  console.log("Usuario conectado al chat en vivo");

  socket.on("message", (message) => {
    io.of("/live-chat").emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado del chat en vivo");
  });
});

io.of("/private-chat").on("connection", (socket) => {
  console.log("Usuario conectado al chat privado");

  // Mantener el estado del usuario en línea
  socket.on("join", (userId) => {
    socket.join(userId);
    userStatus[userId] = "online";
    io.of("/private-chat").emit("userStatus", { userId, status: "online" });
  });

  // Manejar mensajes privados
  socket.on("privateMessage", (message) => {
    io.of("/private-chat").to(message.targetId).emit("privateMessage", message);
  });

  // Obtener el estado del usuario
  socket.on("getUserStatus", (userId) => {
    const status = userStatus[userId] || "offline";
    socket.emit("userStatus", { userId, status });
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log("Usuario desconectado del chat privado");
    // Actualizar el estado de conexión de todos los sockets asociados al usuario
    for (const [userId, socketId] of Object.entries(userStatus)) {
      if (socketId === socket.id) {
        userStatus[userId] = "offline";
        io.of("/private-chat").emit("userStatus", {
          userId,
          status: "offline",
        });
        break;
      }
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
