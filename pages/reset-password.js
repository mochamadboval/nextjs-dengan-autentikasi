import Head from "next/head";
import { useRouter } from "next/router";

import { useRef, useState } from "react";

import { getServerSession } from "next-auth";

import { authOptions } from "./api/auth/[...nextauth]";

import ButtonAuth from "@/components/Form/ButtonAuth";
import ButtonValidate from "@/components/Form/ButtonValidate";
import ErrorMessage from "@/components/Form/ErrorMessage";
import InputAuth from "@/components/Form/InputAuth";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function ResetPassword(props) {
  const { email, recoveryToken } = props;

  const { replace } = useRouter();

  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const comparePasswordHandler = () => {
    const password = passwordRef.current.value;
    const passwordConfirmation = passwordConfirmationRef.current.value;

    if (passwordConfirmation !== password) {
      setIsPasswordMatch(false);
    } else {
      setIsPasswordMatch(true);
    }
  };

  const resetPasswordHandler = async (event) => {
    event.preventDefault();

    setErrorMessage(null);
    setIsValidating(true);

    const password = passwordRef.current.value;
    const passwordConfirmation = passwordConfirmationRef.current.value;

    if (passwordConfirmation !== password) {
      setErrorMessage("Kata sandi tidak cocok.");
      setIsValidating(false);
      return;
    }

    const response = await fetch("/api/auth/reset-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, recoveryToken }),
    });
    const reset = await response.json();

    if (response.status === 201) {
      alert(reset.message);
      replace("/login");
    } else {
      setErrorMessage(reset.message);
      setIsValidating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Kata Sandi - Next.js dengan autentikasi</title>
        <meta
          name="description"
          content="Next.js dengan autentikasi menggunakan NextAuth.js - Halaman Reset Kata Sandi."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Card>
          <h2 className="font-bold text-center text-xl">RESET KATA SANDI</h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form
            className="flex flex-col gap-2 mt-4"
            onSubmit={resetPasswordHandler}
          >
            <InputAuth
              name="Kata Sandi Baru"
              placeholder="********"
              type="password"
              ref={passwordRef}
              comparePassword={comparePasswordHandler}
            />
            <InputAuth
              name="Konfirmasi Kata Sandi Baru"
              placeholder="********"
              type="password"
              ref={passwordConfirmationRef}
              comparePassword={comparePasswordHandler}
            />
            {!isPasswordMatch && (
              <p className="text-red-700 text-xs">Kata sandi tidak cocok.</p>
            )}
            {isValidating ? (
              <ButtonValidate />
            ) : (
              <ButtonAuth>Simpan</ButtonAuth>
            )}
          </form>
        </Card>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ query, req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (session || !query.email || !query.token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      email: query.email,
      recoveryToken: query.token,
    },
  };
}
