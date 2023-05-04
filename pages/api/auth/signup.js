import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { equalTo, get, orderByChild, query, ref, set } from "firebase/database";
import { createTransport } from "nodemailer";

import { database } from "@/helpers/firebase";

export function checkInvalidInput(email, name, password) {
  if (!name) {
    return "Nama tidak boleh kosong.";
  } else if (!email) {
    return "Email tidak boleh kosong.";
  } else if (!email.includes("@")) {
    return "Email harus menggunakan simbol @.";
  } else if (!password || password.length < 8) {
    return "Kata sandi harus minimal 8 karakter.";
  }
}

export async function checkEmailExists(email) {
  const usersRef = ref(database, "users");
  const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
  return await get(emailQuery);
}

async function createUser(email, name, password, verifyToken) {
  const newUserRef = ref(database, `users/${randomUUID()}`);
  await set(newUserRef, {
    email,
    name,
    password,
    verified: false,
    verifyToken,
  });
}

export async function sendEmailVerification(email, name, verifyToken) {
  const transporter = createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });

  const message = `
    <p>Hai, ${name}.</p>
    <p>Verifikasi akun pada tautan berikut:</p>
    <a href="https://nextjs-dengan-autentikasi.vercel.app/confirm?token=${verifyToken}" target="_blank">
      https://nextjs-dengan-autentikasi.vercel.app/confirm?token=${verifyToken}
    </a>
  `;

  await transporter.sendMail({
    from: process.env.ZOHO_USER,
    to: email,
    subject: "[Next.js dengan autentikasi] Verifikasi Akun",
    html: message,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const email = req.body.email.trim();
  const name = req.body.name.trim();
  const password = req.body.password;

  let invalid = checkInvalidInput(email, name, password);
  if (invalid) {
    res.status(422).json({ message: invalid });
    return;
  }

  const user = await checkEmailExists(email);
  if (user.exists()) {
    res.status(422).json({ message: "Email sudah terdaftar." });
    return;
  }

  const hashedPassword = await hash(password, 10);
  const verifyToken = randomUUID();

  await createUser(email, name, hashedPassword, verifyToken);
  await sendEmailVerification(email, name, verifyToken);

  res.status(201).json({ message: "Pendaftaran berhasil." });
}
