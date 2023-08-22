import express from "express";
const router = express.Router();
import checkAuth from "../middleware/checkAuth.js";

import { 
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  validarTokenPassword,
  nuevoPassword,
  perfil
} from "../controllers/usuarioController.js";

//Autenticación, Registro y Confirmación de Usuarios

router.post("/", registrar); //Crea un nuevo usuario
router.post("/login", autenticar); //Autenticar al usuario
router.get("/confirmar/:token", confirmar); //Confirmar la cuenta del usuario con el token X
router.post("/olvide-password", olvidePassword); //Enviar Email para recuperar password
router.get("/olvide-password/:token", validarTokenPassword); //Recibe un token para recuperar el password
router.post("/olvide-password/:token", nuevoPassword); //Envia la info para cambiar el password
router.get("/perfil", checkAuth, perfil);

export default router;
