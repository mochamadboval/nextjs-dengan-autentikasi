import { Plus_Jakarta_Sans } from "next/font/google";

import "@/styles/globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
    </main>
  );
}
