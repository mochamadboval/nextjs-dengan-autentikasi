import Head from "next/head";

import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  update,
} from "firebase/database";

import { database } from "@/helpers/firebase";

import ButtonPage from "@/components/UI/ButtonPage";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function Confirm() {
  return (
    <>
      <Head>
        <title>Verifikasi Akun - Next.js dengan autentikasi</title>
        <meta
          name="description"
          content="Next.js dengan autentikasi menggunakan NextAuth.js - Halaman Verifikasi Akun."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Card>
          <p className="text-center">Akun berhasil diverifikasi.</p>
          <ButtonPage url="/login">Masuk</ButtonPage>
        </Card>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const verifyToken = context.query.token;

  const usersRef = ref(database, "users");
  const tokenQuery = query(
    usersRef,
    orderByChild("verifyToken"),
    equalTo(verifyToken)
  );
  const user = await get(tokenQuery);
  if (!user.exists()) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userObject = user.val();
  const userKey = Object.keys(userObject)[0];

  const userRef = ref(database, `users/${userKey}`);
  await update(userRef, {
    verified: true,
    verifyToken: null,
  });

  return {
    props: {},
  };
}
