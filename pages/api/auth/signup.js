import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { equalTo, get, orderByChild, query, ref, set } from "firebase/database";

import { database } from "@/helpers/firebase";

function checkInvalidInput(email, name, password) {
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

async function createUser(email, name, password) {
  const newUserRef = ref(database, `users/${randomUUID()}`);
  await set(newUserRef, {
    email,
    name,
    password,
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

  await createUser(email, name, hashedPassword);

  res.status(201).json({ message: "Pendaftaran berhasil." });
}
