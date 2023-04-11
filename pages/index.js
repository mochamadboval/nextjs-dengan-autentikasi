import Head from "next/head";

import ButtonPage from "@/components/UI/ButtonPage";
import Card from "@/components/UI/Card";
import Layout from "@/components/UI/Layout";

export default function Home() {
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
          <p className="text-center">Hai, orang asing.</p>
          <ButtonPage url="/login">Masuk</ButtonPage>
        </Card>
      </Layout>
    </>
  );
}
