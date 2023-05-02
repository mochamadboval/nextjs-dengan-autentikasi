import Head from "next/head";

import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]";

import ButtonPage from "@/components/UI/ButtonPage";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function Profile(props) {
  const { user } = props;

  return (
    <>
      <Head>
        <title>{`${user.name} - Next.js dengan autentikasi`}</title>
        <meta
          name="description"
          content="Next.js dengan autentikasi menggunakan NextAuth.js - Halaman Profil."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Card>
          <h2 className="font-bold text-center text-xl">PROFIL</h2>
          <h3 className="font-bold mt-4">Nama</h3>
          <p>{user.name}</p>
          <h3 className="font-bold mt-2">Email</h3>
          <p className="">{user.email}</p>
          <ButtonPage url="/profile/edit">Ubah Profil</ButtonPage>
          <ButtonPage url="/profile/change-password">
            Ubah Kata Sandi
          </ButtonPage>
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
