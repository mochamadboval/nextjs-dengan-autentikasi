import { hash } from "bcryptjs";
import { ref, update } from "firebase/database";

import { database } from "@/helpers/firebase";

import { checkEmailExists } from "./signup";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const email = req.body.email.trim();
  const password = req.body.password;
  const recoveryToken = req.body.recoveryToken.trim();

  if (!password || password.length < 8) {
    res.status(422).json({ message: "Kata sandi harus minimal 8 karakter." });
    return;
  }

  const user = await checkEmailExists(email);
  if (!user.exists()) {
    res.status(422).json({ message: "Email salah." });
    return;
  }

  const userObject = user.val();
  const userKey = Object.keys(userObject)[0];
  const userValue = Object.values(userObject)[0];

  if (recoveryToken !== userValue.recoveryToken) {
    res.status(422).json({ message: "Token tidak valid." });
    return;
  }

  const hashedPassword = await hash(password, 10);

  const userRef = ref(database, `users/${userKey}`);
  await update(userRef, {
    password: hashedPassword,
    recoveryToken: null,
  });

  res.status(201).json({ message: "Reset kata sandi berhasil." });
}
