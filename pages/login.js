import Head from "next/head";
import { useRouter } from "next/router";

import { useRef } from "react";

import { signIn } from "next-auth/react";

import ButtonAuth from "@/components/Form/ButtonAuth";
import InputAuth from "@/components/Form/InputAuth";
import ButtonPage from "@/components/UI/ButtonPage";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function Login() {
  const { replace } = useRouter();

  const emailRef = useRef();
  const passwordRef = useRef();

  const loginHandler = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log(result);

    if (result.status === 200) {
      replace("/");
    }
  };

  return (
    <>
      <Head>
        <title>Masuk - Next.js dengan autentikasi</title>
        <meta
          name="description"
          content="Next.js dengan autentikasi menggunakan NextAuth.js - Halaman Masuk."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Card>
          <h2 className="font-bold text-center text-xl">MASUK</h2>
          <form className="flex flex-col gap-2 mt-4" onSubmit={loginHandler}>
            <InputAuth
              name="Email"
              placeholder="mochamadboval@mail.com"
              type="email"
              ref={emailRef}
            />
            <InputAuth
              name="Kata Sandi"
              placeholder="********"
              type="password"
              ref={passwordRef}
            />
            <ButtonAuth>Masuk</ButtonAuth>
          </form>
          <ButtonPage url="/signup">Daftar</ButtonPage>
        </Card>
      </Layout>
    </>
  );
}
