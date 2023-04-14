import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { ref, set } from "firebase/database";

import { database } from "@/helpers/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const email = req.body.email.trim();
  const name = req.body.name.trim();
  const password = req.body.password;
  const hashedPassword = await hash(password, 10);

  const newUserRef = ref(database, `users/${randomUUID()}`);
  await set(newUserRef, {
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "Pendaftaran berhasil." });
}
