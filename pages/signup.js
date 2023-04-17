import Head from "next/head";
import { useRouter } from "next/router";

import { useRef, useState } from "react";

import ButtonAuth from "@/components/Form/ButtonAuth";
import InputAuth from "@/components/Form/InputAuth";
import ButtonPage from "@/components/UI/ButtonPage";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function SignUp() {
  const { replace } = useRouter();

  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const comparePasswordHandler = () => {
    const password = passwordRef.current.value;
    const passwordConfirmation = passwordConfirmationRef.current.value;

    if (passwordConfirmation !== password) {
      setIsPasswordMatch(false);
    } else {
      setIsPasswordMatch(true);
    }
  };

  const signUpHandler = async (event) => {
    event.preventDefault();

    setErrorMessage(null);

    const email = emailRef.current.value;
    const name = nameRef.current.value;
    const password = passwordRef.current.value;
    const passwordConfirmation = passwordConfirmationRef.current.value;

    if (passwordConfirmation !== password) {
      setErrorMessage("Kata sandi tidak cocok.");
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password }),
    });
    const newUser = await response.json();

    if (response.status === 201) {
      alert(newUser.message);
      replace("/login");
    } else {
      setErrorMessage(newUser.message);
    }
  };

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
          {errorMessage && (
            <p className="bg-red-50 mt-4 p-3 rounded text-center text-red-700 text-sm">
              {errorMessage}
            </p>
          )}
          <form className="flex flex-col gap-2 mt-4" onSubmit={signUpHandler}>
            <InputAuth
              name="Nama"
              placeholder="Mochamad Boval"
              type="text"
              ref={nameRef}
            />
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
              comparePassword={comparePasswordHandler}
            />
            <InputAuth
              name="Konfirmasi Kata Sandi"
              placeholder="********"
              type="password"
              ref={passwordConfirmationRef}
              comparePassword={comparePasswordHandler}
            />
            {!isPasswordMatch && (
              <p className="text-red-700 text-xs">Kata sandi tidak cocok.</p>
            )}
            <ButtonAuth>Daftar</ButtonAuth>
          </form>
          <ButtonPage url="/login">Masuk</ButtonPage>
        </Card>
      </Layout>
    </>
  );
}
