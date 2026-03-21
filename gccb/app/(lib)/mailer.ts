import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const accessToken = await new Promise<string>((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err || !token) {
        reject("Fallo al obtener el token de acceso de Google");
      } else {
        resolve(token);
      }
    });
  });

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      accessToken,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  } as any);
};

export const enviarCorreoVerificacion = async (emailDestino: string, nombreUsuario: string, linkVerificacion: string) => {
  try {
    const emailTransporter = await createTransporter();
    
    const mailOptions = {
      from: `"GCCB Sistema" <${process.env.GMAIL_USER}>`,
      to: emailDestino,
      subject: "🚀 Activa tu cuenta de Mesero - GCCB",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background-color: #ffffff;">
          <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -1px;">Hola, <span style="color: #ea580c;">${nombreUsuario}</span></h2>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Bienvenido al equipo. Se ha creado tu perfil de mesero en GCCB. Para empezar a trabajar, necesitas activar tu cuenta y crear tu contraseña personal.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${linkVerificacion}" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 16px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3);">
              ESTABLECER MI CONTRASEÑA
            </a>
          </div>
          
          <p style="font-size: 13px; color: #94a3b8; text-align: center;">
            ¿El botón no funciona? Copia este link:<br>
            <span style="color: #ea580c;">${linkVerificacion}</span>
          </p>
        </div>
      `,
    };

    await emailTransporter.sendMail(mailOptions);
    return { success: true };
    
  } catch (error) {
    console.error("Error enviando el correo:", error);
    return { success: false, error };
  }
};

// app/(lib)/mailer.ts
// app/(lib)/mailer.ts

export const enviarCorreoReset = async (emailDestino: string, nombre: string, link: string) => {
  try {
    const transporter = await createTransporter(); // Usamos tu función existente
    await transporter.sendMail({
      from: `"Seguridad GCCB" <${process.env.GMAIL_USER}>`,
      to: emailDestino,
      subject: "Restablecer tu contraseña - GCCB",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #0f172a;">¿Olvidaste tu contraseña, ${nombre}?</h2>
          <p>No te preocupes. Haz clic en el botón de abajo para elegir una nueva clave de acceso.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold;">RESTABLECER CONTRASEÑA</a>
          </div>
          <p style="font-size: 11px; color: #94a3b8;">Si tú no pediste este cambio, ignora este correo.</p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};