import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"RediBo Notificaciones" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Correo enviado: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return false;
  }
};
