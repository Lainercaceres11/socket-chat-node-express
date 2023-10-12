const URL_ENDPOINT = "http://localhost:8080/api/auth/";

let usuario = null;
let socket = null;

// Referencias html

const idUsuario = document.getElementById("idUsuario");
const mensaje = document.getElementById("mensaje");
const ulUsarios = document.getElementById("ulUsarios");
const ulMensajes = document.getElementById("ulMensajes");
const btnSalir = document.getElementById("btnSalir");

const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";

  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No es un token valido");
  }

  const resp = await fetch(URL_ENDPOINT, {
    headers: {
      "x-token": token,
    },
  });

  const { usuario: userDB, token: tokenDB } = await resp.json();
  console.log(userDB, tokenDB);
  localStorage.setItem("token", tokenDB);
  usuario = userDB;
  document.title = usuario.name;

  await conectarSocket();
};

const conectarSocket = async () => {
  // Enviar informacion desde socket en el frontend
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("User online");
  });

  socket.on("disconnect", () => {
    console.log("User offline");
  });

  socket.on("recibir-mensajes", (payload) => {
    dibujarMensajes(payload);
  });

  socket.on("usuarios-activos", (payload) => {
    dibujarUsuarios(payload);
  });

  socket.on("mensaje-privado", (payload) => {
    console.log("Mensaje privado", payload)
  });
};

function dibujarUsuarios(usuarios = []) {
  let userHTML = "";

  usuarios.forEach(({ name, uid }) => {
    userHTML += `
    <li>
     <p>
     <h3 class="text-success"> ${name} </h3>
     <span class="text-success">${uid}</span></p>
    </li>
    `;
  });

  ulUsarios.innerHTML = userHTML;
}

function dibujarMensajes(mensajes = []) {
  console.log(mensajes)
  let mensajesHTML = "";

  mensajes.forEach(({ uid, mensaje }) => {
    mensajesHTML += `
    <li>
     <p>
     <span class="text-success"> ${uid} </span>
     <span class="text-success">${mensaje}</span>
     </p>
    </li>
    `;
  });

  ulMensajes.innerHTML = mensajesHTML;
}

mensaje.addEventListener("keyup", ({ keyCode }) => {
  const textMensaje = mensaje.value;
  const uuid = textMensaje.uid;

  if (keyCode !== 13) {
    return;
  }
  if (keyCode.length === 0) {
    return;
  }

  socket.emit("enviar-mensaje", { textMensaje, uuid });

  textMensaje.value = "";
});

const main = async () => {
  await validarJWT();
};

main();
