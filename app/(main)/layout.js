import { Inter } from 'next/font/google';
import "../globals.css";
import Header from "../components/Header";
import AuthProvider from "../components/AuthProvider";

const inter = Inter({ subsets: ['latin'], weight: ['100','200','300','400','500','600','700'] });

export const metadata = {
  title: {
    default: "Balanced+ | Centro de Pilates, Yoga y Entrenamiento en Godella",
    template: "%s | Balanced+ Godella"
  },
  description: "Centro de pilates reformer, barre, entrenamiento funcional y yoga en Godella y Campolivar. Clases reducidas con instructores certificados.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
    </>
  );
}