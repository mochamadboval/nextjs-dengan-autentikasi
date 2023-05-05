import Head from "next/head";
import { useRouter } from "next/router";

import { useRef, useState } from "react";

import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import { authOptions } from "../api/auth/[...nextauth]";

import ButtonAuth from "@/components/Form/ButtonAuth";
import ButtonValidate from "@/components/Form/ButtonValidate";
import ErrorMessage from "@/components/Form/ErrorMessage";
import InputAuth from "@/components/Form/InputAuth";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function EditProfile(props) {
  const { email, name } = props.user;

  const { data: session, update } = useSession();

  const { replace } = useRouter();

  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const editProfileHandler = async (event) => {
    event.preventDefault();

    setErrorMessage(null);
    setIsValidating(true);

    const newEmail = emailRef.current.value;
    const name = nameRef.current.value;
    const password = passwordRef.current.value;

    const response = await fetch("/api/auth/edit-profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, newEmail, password }),
    });
    if (response.status === 304) {
      replace("/profile");
      return;
    }

    const edit = await response.json();

    if (response.status === 200) {
      const newSession = {
        ...session,
        user: {
          ...session?.user,
          email: newEmail,
          name,
        },
      };
      await update(newSession);

      alert(edit.message);
      replace("/profile");
    } else {
      setErrorMessage(edit.message);
      setIsValidating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ubah Profil - Next.js dengan autentikasi</title>
        <meta
          name="description"
          content="Next.js dengan autentikasi menggunakan NextAuth.js - Halaman Ubah Profil."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Card>
          <h2 className="font-bold text-center text-xl">UBAH PROFIL</h2>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <form
            className="flex flex-col gap-2 mt-4"
            onSubmit={editProfileHandler}
          >
            <InputAuth
              name="Nama"
              placeholder="Mochamad Boval"
              type="text"
              ref={nameRef}
              value={name}
            />
            <InputAuth
              name="Email"
              placeholder="mochamadboval@mail.com"
              type="email"
              ref={emailRef}
              value={email}
            />
            <InputAuth
              name="Kata Sandi *"
              placeholder="********"
              type="password"
              ref={passwordRef}
            />
            <p className="text-xs">* untuk konfirmasi perubahan.</p>
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
      user: session.user,
    },
  };
}
