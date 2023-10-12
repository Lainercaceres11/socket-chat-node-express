const { Socket } = require("socket.io");
const { validarJWT } = require("../helpers/generar-jwt");
const ChatMensajes = require("../models/chat-mensajes");

const chatMensaje = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
  const token = socket.handshake.headers["x-token"];

  const usuario = await validarJWT(token);

  if (!usuario) {
    return socket.disconnect();
  }

  // Agregamos usuario
  chatMensaje.agregarUsuario(usuario);

  // Emitimos usuarios
  io.emit("usuarios-activos", chatMensaje.getUsuarios);
  socket.emit("recibir-mensajes", chatMensaje.getMensajes);

  // Conectarlo a una sala especial
  socket.join(usuario.id);

  socket.on("enviar-mensaje", ({ uid, textMensaje }) => {
    if (uid) {
      socket.to(uid).emit("mensaje-privado", { de: usuario.id, textMensaje });
    } else {
      chatMensaje.enviarMensaje(usuario.id, usuario.name, textMensaje);
      io.emit("recibir-mensajes", chatMensaje.getMensajes);
    }
  });

  socket.on("disconnect", () => {
    chatMensaje.desconectarUsuario(usuario.id);
    io.emit("usuarios-activos", chatMensaje.getUsuarios);
  });
};

module.exports = socketController;
