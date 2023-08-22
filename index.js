import express from "express";
import cors from "cors";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import usuariosRouter from "./routes/usuarioRoutes.js";
import proyectosRouter from "./routes/proyectosRouter.js";
import tareaRouter from "./routes/tareaRouter.js";

const app = express();
app.use(express.json());

//Buscará el archivo .env
dotenv.config();

conectarDB();

//Habilitar CORS

//Dominios permitidos
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      //Puede consultar la API
      callback(null, true);
    } else {
      //No está permitido
      callback(new Error("Error de CORS"));
    }
  },
};

app.use(cors(corsOptions));

//Routing

//Asignamos el router a una ruta x definida en el index.js
app.use("/api/usuarios", usuariosRouter);
app.use("/api/proyectos", proyectosRouter);
app.use("/api/tareas", tareaRouter);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
  console.log("http://localhost:4000");
});

//Socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Conectado a Socket.io");

  //Definir los eventos de socket io
  socket.on("prueba", (nombre) => {
    console.log("Prueba desde socket.io", nombre);

    socket.emit("respuesta", { nombre: "Juan" });
  });

  socket.on("abrir proyecto", (proyecto) => {
    socket.join(proyecto);
  });

  socket.on("nueva tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea agregada", tarea);
  });

  socket.on("eliminar tarea", (tarea) => {
    socket.to(tarea.proyecto).emit("tarea eliminada", tarea);
  });

  socket.on("actualizar tarea", (tarea) => {
    socket.to(tarea.proyecto._id).emit("tarea actualizada", tarea);
  });

  socket.on("cambiar estado", (tarea) => {
    socket.to(tarea.proyecto._id).emit("nuevo estado", tarea);
  });
});
