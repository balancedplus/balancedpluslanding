//import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google';
import "../globals.css";
import Header from "../components/Header";
import AuthProvider from "../components/AuthProvider";
//const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
//const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ subsets: ['latin'], weight: ['100','200','300','400','500','600','700'] });

export const metadata = {
  title: "Balanced+",
  description: "Landing page",
};

export default function RootLayout({ children }) {
  return (
      <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
