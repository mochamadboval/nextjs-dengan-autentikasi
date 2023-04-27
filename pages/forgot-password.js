import Head from "next/head";

import { useRef, useState } from "react";

import { getServerSession } from "next-auth";

import { authOptions } from "./api/auth/[...nextauth]";

import ButtonAuth from "@/components/Form/ButtonAuth";
import ButtonValidate from "@/components/Form/ButtonValidate";
import ErrorMessage from "@/components/Form/ErrorMessage";
import InputAuth from "@/components/Form/InputAuth";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function ForgotPassword() {
  const emailRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const recoveryAccountHandler = async (event) => {
    event.preventDefault();

    setErrorMessage(null);
    setIsValidating(true);

    const email = emailRef.current.value;

    const response = await fetch("/api/auth/recovery-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const recovery = await response.json();

    if (response.status === 200) {
      alert(recovery.message);
    } else {
      setErrorMessage(recovery.message);
    }

    setIsValidating(false);
  };

  return (
    <>
      <Head>
        <title>Lupa Kata Sandi - Next.js dengan autentikasi</title>
        <meta
          name="description"
          content="Next.js dengan autentikasi menggunakan NextAuth.js - Halaman Lupa Kata Sandi."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Card>
          <h2 className="font-bold text-center text-xl">Lupa Kata Sandi</h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form
            className="flex flex-col gap-2 mt-4"
            onSubmit={recoveryAccountHandler}
          >
            <InputAuth
              name="Email"
              placeholder="mochamadboval@mail.com"
              type="email"
              ref={emailRef}
            />
            {isValidating ? (
              <ButtonValidate />
            ) : (
              <ButtonAuth>Pulihkan Akun</ButtonAuth>
            )}
          </form>
        </Card>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
