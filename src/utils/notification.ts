// para enviar notificacion por email
import nodemailer from 'nodemailer'

// Función para enviar notificación por correo
export const sendNotification = async (to: string, subject: string, message: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  })

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text: message,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Notificación enviada')
  } catch (error) {
    console.error('Error al enviar notificación:', error)
  }
}
