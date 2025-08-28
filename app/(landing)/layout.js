import { Geist, Geist_Mono } from "next/font/google";
import "../landing.css";
import HeaderLanding from "./landing/components/HeaderLanding";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Balanced+",
  description: "Landing page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/monogramaiconblack.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/monogramaiconwhite.png" media="(prefers-color-scheme: dark)" />
      </head>

      <body>
        {/* HEADER traslúcido: el fondo y blur lo aplica globals.css */}
        <HeaderLanding/>

        {/* MAIN ocupa toda la altura restante */}
        <main style={{ display: "flex", justifyContent: "center", alignItems: "center",
                      minHeight: "calc(100vh - 10px)" }}>
          {children}
        </main>


      </body>
    </html>
  );
}