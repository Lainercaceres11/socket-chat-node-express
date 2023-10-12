class Mensajes {
  constructor(uid, nombre, mensaje) {
    (this.uid = uid), (this.nombre = nombre), (this.mensaje = mensaje);
  }
}

class ChatMensajes {
  constructor() {
    (this.mensajes = []), (this.usuarios = {});
  }

  get getMensajes() {
    this.mensajes = this.mensajes.slice(0, 10);
    return this.mensajes;
  }

  get getUsuarios() {
    return Object.values(this.usuarios);
  }

  enviarMensaje(uid, nombre, mensaje) {
    this.mensajes.unshift(new Mensajes(uid, nombre, mensaje));
  }

  agregarUsuario (usuario){
    this.usuarios[usuario.id] = usuario
  }

  desconectarUsuario(id){
    delete this.usuarios[id]

  }
}

module.exports = ChatMensajes
