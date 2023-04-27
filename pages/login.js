import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useRef, useState } from "react";

import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";

import { authOptions } from "./api/auth/[...nextauth]";

import ButtonAuth from "@/components/Form/ButtonAuth";
import ButtonValidate from "@/components/Form/ButtonValidate";
import ErrorMessage from "@/components/Form/ErrorMessage";
import InputAuth from "@/components/Form/InputAuth";
import ButtonPage from "@/components/UI/ButtonPage";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function Login() {
  const { replace } = useRouter();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const loginHandler = async (event) => {
    event.preventDefault();

    setErrorMessage(null);
    setIsValidating(true);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result.status === 200) {
      replace("/");
    } else {
      setErrorMessage(result.error);
      setIsValidating(false);
    }
  };

  const resendVerificationHandler = async () => {
    const email = emailRef.current.value;

    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const resend = await response.json();

    if (response.status === 200) {
      alert(resend.message);
    } else {
      setErrorMessage(resend.message);
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
          {errorMessage && (
            <ErrorMessage onResend={resendVerificationHandler}>
              {errorMessage}
            </ErrorMessage>
          )}
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
            <Link
              href="/forgot-password"
              className="self-end text-blue-700 text-sm underline"
            >
              Lupa kata sandi
            </Link>
            {isValidating ? <ButtonValidate /> : <ButtonAuth>Masuk</ButtonAuth>}
          </form>
          <ButtonPage url="/signup">Daftar</ButtonPage>
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
