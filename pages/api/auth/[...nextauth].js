import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { compare } from "bcryptjs";

import { checkEmailExists } from "./signup";

export const authOptions = {
  callbacks: {
    async jwt({ session, token, trigger, user }) {
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }

      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
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

        if (!userValue.verified) {
          throw new Error("Cek email untuk verifikasi akun terlebih dahulu.");
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
