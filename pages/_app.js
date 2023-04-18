import { Plus_Jakarta_Sans } from "next/font/google";

import { SessionProvider } from "next-auth/react";

import "@/styles/globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
