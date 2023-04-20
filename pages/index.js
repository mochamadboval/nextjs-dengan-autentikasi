import Head from "next/head";

import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

import { authOptions } from "./api/auth/[...nextauth]";

import ButtonPage from "@/components/UI/ButtonPage";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function Home(props) {
  const { user } = props;

  const logoutHandler = () => {
    signOut();
  };

  return (
    <>
      <Head>
        <title>Next.js dengan autentikasi</title>
        <meta
          name="description"
          content="Next.js dengan autentikasi menggunakan NextAuth.js."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Card>
          <p className="text-center">
            Hai, {user ? user.name : "orang asing"}.
          </p>
          {user ? (
            <button
              className="bg-red-700 border border-red-700 mt-4 p-2.5 rounded text-center text-white w-full"
              onClick={logoutHandler}
            >
              Keluar
            </button>
          ) : (
            <ButtonPage url="/login">Masuk</ButtonPage>
          )}
        </Card>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  return {
    props: {
      user: session ? session.user : null,
    },
  };
}
