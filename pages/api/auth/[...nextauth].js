import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { compare } from "bcryptjs";

import { checkEmailExists } from "./signup";

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await checkEmailExists(email);
        if (!user.exists()) {
          throw new Error("Email atau kata sandi salah.");
        }

        const userObject = user.val();
        const userValue = Object.values(userObject)[0];

        const isPasswordValid = await compare(password, userValue.password);
        if (!isPasswordValid) {
          throw new Error("Email atau kata sandi salah.");
        }

        return { email: userValue.email, image: null, name: userValue.name };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
};

export default NextAuth(authOptions);
