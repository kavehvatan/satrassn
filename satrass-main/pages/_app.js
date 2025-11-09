// pages/_app.js
import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import localFont from "next/font/local";

const bnazanin = localFont({
  src: [
    { path: "../public/fonts/bnazanin/BNazanin.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/bnazanin/BNazanin.woff",  weight: "400", style: "normal" },
  ],
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial"],
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const showFooter = router.pathname !== "/"; // فوتر همه‌جا به‌جز خانه

  return (
    <div dir="rtl" lang="fa" className={`${bnazanin.className} min-h-[100svh] flex flex-col`}>
      <Header />

      {/* محتوای هر صفحه */}
      <main className="flex-1">
        <Component {...pageProps} />
      </main>

      {/* فوتر سراسری؛ اگر صفحهٔ خانه نیست */}
      {showFooter && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}
    </div>
  );
}