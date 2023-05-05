import { compare } from "bcryptjs";
import { ref, update } from "firebase/database";

import { database } from "@/helpers/firebase";

import { checkEmailExists, checkInvalidInput } from "./signup";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const email = req.body.email.trim();
  const newEmail = req.body.newEmail.trim();
  const name = req.body.name.trim();
  const password = req.body.password;

  let invalid = checkInvalidInput(email, name, password);
  if (invalid) {
    res.status(422).json({ message: invalid });
    return;
  }

  const user = await checkEmailExists(email);
  const userObject = user.val();
  const userKey = Object.keys(userObject)[0];
  const userValue = Object.values(userObject)[0];

  const isPasswordValid = await compare(password, userValue.password);
  if (!isPasswordValid) {
    res.status(422).json({ message: "Kata sandi salah." });
    return;
  }

  if (newEmail === userValue.email && name === userValue.name) {
    res.status(304).end();
    return;
  }

  const userRef = ref(database, `users/${userKey}`);
  await update(userRef, {
    email: newEmail,
    name,
  });

  res.status(200).json({ message: "Profil berhasil diubah." });
}
