const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Inicializar Express
const app = express();
const server = http.createServer(app);

// Configurar CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Middleware para JSON
app.use(express.json());

// Rutas
app.get("/status", (req, res) => {
  res.json({ message: "Servidor en funcionamiento" });
});

// Inicializar Socket.IO
const io = new Server(server, {
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

// Leer el puerto desde variables de entorno o usar el puerto 3000 por defecto
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
