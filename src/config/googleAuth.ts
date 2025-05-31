import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import { findOrCreateGoogleUser } from "../services/auth.service";
import { generateToken } from "../utils/generateToken";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No se pudo obtener el email"), false);

        // Buscar usuario sin crear
        const user = await prisma.usuario.findUnique({ where: { email } });

        console.log("📧 Email obtenido de Google:", email); // 👈 Log 2
        if (!email)
          return done(
            new Error("No se pudo obtener el email de Google"),
            false
          );
        console.log("🔄 Buscando/creando usuario en DB...");
        const { user, isNew } = await findOrCreateGoogleUser(email, name);

        const token = generateToken({
          idUsuario: user.idUsuario,
          email: user.email,
          nombreCompleto: user.nombreCompleto,
        });

        if (user.registradoCon === "email") {
          console.warn("⚠️ Correo ya registrado manualmente:", email);

          console.log("✅ Usuario autenticado y token generado");

          // ✅ Devolver token junto con usuario
          return done(null, false, {
            message: "alreadyExists",
            token,
            email,
          });
          return done(null, newUser);  // devuelve el email nomás
        }
      } catch (error: any) {
        console.error("❌ Error en GoogleStrategy:", error);
        if (error.name === "EmailAlreadyRegistered") {
          return done(null, false, { message: error.message });
        }

        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.email); // 👈 guardamos solo el email
});

passport.deserializeUser(async (email: string, done) => {
  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
