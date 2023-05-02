import Head from "next/head";
import { useRouter } from "next/router";

import { useRef, useState } from "react";

import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]";

import ButtonAuth from "@/components/Form/ButtonAuth";
import ButtonValidate from "@/components/Form/ButtonValidate";
import ErrorMessage from "@/components/Form/ErrorMessage";
import InputAuth from "@/components/Form/InputAuth";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function ChangePassword(props) {
  const { email } = props;

  const { replace } = useRouter();

  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const newPasswordConfirmationRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const comparePasswordHandler = () => {
    const password = newPasswordRef.current.value;
    const passwordConfirmation = newPasswordConfirmationRef.current.value;

    if (passwordConfirmation !== password) {
      setIsPasswordMatch(false);
    } else {
      setIsPasswordMatch(true);
    }
  };

  const changePasswordHandler = async (event) => {
    event.preventDefault();

    setErrorMessage(null);
    setIsValidating(true);

    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const newPasswordConfirmation = newPasswordConfirmationRef.current.value;

    if (newPasswordConfirmation !== newPassword) {
      setErrorMessage("Kata sandi tidak cocok.");
      setIsValidating(false);
      return;
    }

    const response = await fetch("/api/auth/change-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, oldPassword, newPassword }),
    });
    const changed = await response.json();

    if (response.status === 200) {
      alert(changed.message);
      replace("/profile");
    } else {
      setErrorMessage(changed.message);
      setIsValidating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ubah Kata Sandi - Next.js dengan autentikasi</title>
        <meta
          name="description"
          content="Next.js dengan autentikasi menggunakan NextAuth.js - Halaman Ubah Kata Sandi."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Card>
          <h2 className="font-bold text-center text-xl">UBAH KATA SANDI</h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form
            className="flex flex-col gap-2 mt-4"
            onSubmit={changePasswordHandler}
          >
            <InputAuth
              name="Kata Sandi Saat Ini"
              placeholder="********"
              type="password"
              ref={oldPasswordRef}
            />
            <InputAuth
              name="Kata Sandi Baru"
              placeholder="********"
              type="password"
              ref={newPasswordRef}
              comparePassword={comparePasswordHandler}
            />
            <InputAuth
              name="Konfirmasi Kata Sandi Baru"
              placeholder="********"
              type="password"
              ref={newPasswordConfirmationRef}
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

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      email: session.user.email,
    },
  };
}
