import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  //CÓDIGO OBTENIDO DE MAILTRAP
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Información Email
  await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Confirma tu Cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `
    <p>Hola: ${nombre}, comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta está casi lista, solo debes confirmarla en el siguiente enlace: </p>
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>

    <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
    `,
  });
};

export const emailPassword = async (datos) => {
  const { email, nombre, token } = datos;

  //CÓDIGO OBTENIDO DE MAILTRAP
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Información Email
  await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Recupera tu Password",
    text: "Recupera tu Password",
    html: `
    <p>Hola: ${nombre}, recupera el acceso a tu cuenta en UpTask</p>
    <p>Recupera el acceso a tu cuenta, solo debes ingresar en el siguiente enlace: </p>
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Recuperar Acceso</a>

    <p>Si tu no solicitaste este cambio puedes ignorar este mensaje</p>
    `,
  });
};
