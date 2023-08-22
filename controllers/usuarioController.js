import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";
import { generarID } from "../helpers/generarID.js";
import { emailRegistro, emailPassword } from "../helpers/emails.js";

const registrar = async (req, res) => {
  //Evitar Registros Duplicados
  const { email } = req.body;

  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("El Usuario ya se encuentra registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    //Crea un objeto de tipo Usuario con la información
    const usuario = new Usuario(req.body);
    await usuario.save();

    //Enviar Email Confirmación
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    //Retornamos una respuesta al frontend
    res.json({
      msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //Compronar si el usuario existe
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El Usuario NO está registrado");
    return res.status(404).json({ msg: error.message });
  }

  //Comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    const error = new Error("El Usuario NO está confirmado");
    return res.status(403).json({ msg: error.message });
  }

  //Comprobar el password
  if (await usuario.comprobarPassword(password)) {
    //Retornamos un objeto con la siguiente información
    return res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  try {
    //Verificar si hay un usuario con ese token
    const usuarioConfirmar = await Usuario.findOne({ token });

    if (!usuarioConfirmar) {
      const error = new Error("Token inválido o ya caducó");
      return res.status(403).json({ msg: error.message });
    }

    //Actualizar la confirmación y reinicar token en caso de que si se encuentre
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = null;

    await usuarioConfirmar.save();

    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({ email });

    if (!existeUsuario) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }

    existeUsuario.token = generarID();
    await existeUsuario.save();

    emailPassword({
      nombre: existeUsuario.nombre,
      email: existeUsuario.email,
      token: existeUsuario.token,
    });

    res.json({ msg: "Hemos enviado un Email para que reinicies tu password" });
  } catch (error) {
    console.log(error);
  }
};

const validarTokenPassword = async (req, res) => {
  const { token } = req.params;

  try {
    const tokenValido = await Usuario.findOne({ token });

    if (!tokenValido) {
      const error = new Error("Token no válido");
      return res.status(403).json({ msg: error.message });
    }

    //Si encuentra el token para reiniciar el password, retornamos un true para poder mostrar el formulario
    res.json({ msg: "Token válido el usuario existe" });
  } catch (error) {
    console.log(error);
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const usuario = await Usuario.findOne({ token });

    if (!usuario) {
      const error = new Error("Token no válido");
      return res.status(403).json({ msg: error.message });
    }

    //Reescribimos el password
    usuario.password = password;
    usuario.token = null;

    await usuario.save();

    res.json({ msg: "Password Modificado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const perfil = async (req, res) => {
  //Como ya establecimo en el req la variable de usuario podemos extraerla
  const { usuario } = req;

  res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  validarTokenPassword,
  nuevoPassword,
  perfil,
};
