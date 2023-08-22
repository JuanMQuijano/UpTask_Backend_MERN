import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generarID } from "../helpers/generarID.js";

const usuarioSchema = mongoose.Schema(
  {
    //Dentro del Schema como un objeto, definimos el nombre y tipo de dato que tendrá el Schema
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
      default: generarID(),
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  //Definimos los timestamps, para agregar las columnas de cuando fue creado y cuando fue actualizado
  {
    timestamps: true,
  }
);

//Este código se ejecuta antes de guardar el registro en la BD
usuarioSchema.pre("save", async function (next) {
  //Verifica si el password ya está hasheado
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

//Definimos el modelo, recibe el nombre del modelo y el Schema
const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
