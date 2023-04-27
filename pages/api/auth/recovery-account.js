import { randomUUID } from "crypto";
import { ref, update } from "firebase/database";
import { createTransport } from "nodemailer";

import { database } from "@/helpers/firebase";

import { checkEmailExists } from "./signup";

async function sendEmailRecovery(email, name, recoveryToken) {
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
    <p>Pulihkan akun pada tautan berikut:</p>
    <a href="https://nextjs-dengan-autentikasi.vercel.app/reset-password?email=${email}&token=${recoveryToken}" target="_blank">
      https://nextjs-dengan-autentikasi.vercel.app/reset-password?email=${email}&token=${recoveryToken}
    </a>
  `;

  await transporter.sendMail({
    from: process.env.ZOHO_USER,
    to: email,
    subject: "[Next.js dengan autentikasi] Pulihkan Akun",
    html: message,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const email = req.body.email.trim();

  const user = await checkEmailExists(email);
  if (!user.exists()) {
    res.status(422).json({ message: "Email salah." });
    return;
  }

  const userObject = user.val();
  const userKey = Object.keys(userObject)[0];
  const userValue = Object.values(userObject)[0];

  const recoveryToken = randomUUID();

  const userRef = ref(database, `users/${userKey}`);
  await update(userRef, {
    recoveryToken,
  });

  await sendEmailRecovery(userValue.email, userValue.name, recoveryToken);

  res.status(200).json({ message: "Cek email untuk langkah selanjutnya." });
}
