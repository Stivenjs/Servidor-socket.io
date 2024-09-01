const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatController");

// Ruta para enviar un mensaje (Ejemplo)
router.post("/send-message", (req, res) => {
  const { message } = req.body;
  sendMessage(message);
  res.status(200).json({ status: "Message sent" });
});

module.exports = router;
