import { compare, hash } from "bcryptjs";
import { ref, update } from "firebase/database";

import { database } from "@/helpers/firebase";

import { checkEmailExists } from "./signup";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const email = req.body.email.trim();
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (!newPassword || newPassword.length < 8) {
    res.status(422).json({ message: "Kata sandi harus minimal 8 karakter." });
    return;
  }

  const user = await checkEmailExists(email);
  const userObject = user.val();
  const userKey = Object.keys(userObject)[0];
  const userValue = Object.values(userObject)[0];

  const isOldPasswordValid = await compare(oldPassword, userValue.password);
  if (!isOldPasswordValid) {
    res.status(422).json({ message: "Kata sandi saat ini salah." });
    return;
  }

  const hashedPassword = await hash(newPassword, 10);

  const userRef = ref(database, `users/${userKey}`);
  await update(userRef, {
    password: hashedPassword,
  });

  res.status(200).json({ message: "Kata sandi berhasil diubah." });
}
