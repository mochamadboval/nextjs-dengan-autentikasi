import Head from "next/head";

import ButtonAuth from "@/components/Form/ButtonAuth";
import InputAuth from "@/components/Form/InputAuth";
import ButtonPage from "@/components/UI/ButtonPage";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Daftar - Next.js dengan autentikasi</title>
        <meta
          name="description"
          content="Next.js dengan autentikasi menggunakan NextAuth.js - Halaman Daftar."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Card>
          <h2 className="font-bold text-center text-xl">DAFTAR</h2>
          <form className="flex flex-col gap-2 mt-4">
            <InputAuth name="Nama" placeholder="Mochamad Boval" type="text" />
            <InputAuth
              name="Email"
              placeholder="mochamadboval@mail.com"
              type="email"
            />
            <InputAuth
              name="Kata Sandi"
              placeholder="********"
              type="password"
            />
            <InputAuth
              name="Konfirmasi Kata Sandi"
              placeholder="********"
              type="password"
            />
            <ButtonAuth>Daftar</ButtonAuth>
          </form>
          <ButtonPage url="/login">Masuk</ButtonPage>
        </Card>
      </Layout>
    </>
  );
}
