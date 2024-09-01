const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("message", (message) => {
      console.log("Mensaje recibido:", message);
      io.emit("message", message); // Enviar mensaje a todos los clientes
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
};

const sendMessage = (message) => {
  if (io) {
    io.emit("message", message);
  }
};

module.exports = {
  initializeSocket,
  sendMessage,
};
