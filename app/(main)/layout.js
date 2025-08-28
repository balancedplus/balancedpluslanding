//import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google';
import "../globals.css";
import Header from "../components/Header";

//const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
//const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ subsets: ['latin'], weight: ['100','200','300','400','500','600','700'] });

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
        <Header/>

        {/* MAIN ocupa toda la altura restante */}
        <main>
          {children}
        </main>


      </body>
    </html>
  );
}
