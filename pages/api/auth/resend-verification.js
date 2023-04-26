import { checkEmailExists, sendEmailVerification } from "./signup";

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
  const userValue = Object.values(userObject)[0];

  if (!userValue.verifyToken) {
    res.status(422).json({ message: "Akun sudah terverifikasi." });
    return;
  }

  await sendEmailVerification(
    userValue.email,
    userValue.name,
    userValue.verifyToken
  );

  res.status(200).json({ message: "Email verifikasi terkirim." });
}
