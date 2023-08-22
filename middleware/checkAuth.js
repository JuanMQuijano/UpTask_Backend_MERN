import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
  let token;

  //Los headers será donde se enviará el JWT

  //Revisamos que en la petición tenga el token de autorización y empiece con Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Obtenemos el token

    try {
      token = req.headers.authorization.split(" ")[1];

      //Verificamos si coincide el token recibido con la palabra secreta - Si coincide retorna el valor almacenado en ese token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Agregamos una nueva variable al req - guardamos toda la info del usuario que tenga el id X
      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -confirmado -token -createdAt -updatedAt -__v"
      );

      //Sirve para ejecutar la siguiente función
      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Hubo un error" });
    }
  }

  if (!token) {
    const error = new Error("Token no válido");
    return res.status(401).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
