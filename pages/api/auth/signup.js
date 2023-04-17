import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { equalTo, get, orderByChild, query, ref, set } from "firebase/database";

import { database } from "@/helpers/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const email = req.body.email.trim();
  const name = req.body.name.trim();
  const password = req.body.password;

  let invalid = null;
  if (!name) {
    invalid = "Nama tidak boleh kosong.";
  } else if (!email) {
    invalid = "Email tidak boleh kosong.";
  } else if (!email.includes("@")) {
    invalid = "Email harus menggunakan simbol @.";
  } else if (!password || password.length < 8) {
    invalid = "Kata sandi harus minimal 8 karakter.";
  }

  if (invalid) {
    res.status(422).json({ message: invalid });
    return;
  }

  const usersRef = ref(database, "users");
  const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
  const user = await get(emailQuery);
  if (user.exists()) {
    res.status(422).json({ message: "Email sudah terdaftar." });
    return;
  }

  const hashedPassword = await hash(password, 10);

  const newUserRef = ref(database, `users/${randomUUID()}`);
  await set(newUserRef, {
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "Pendaftaran berhasil." });
}
