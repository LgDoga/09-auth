import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import AuthProvider from "../components/AuthProvider/AuthProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub is a simple and efficient application for managing personal notes.",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub is a simple and efficient application for managing personal notes.",
    url: "https://notehub.com/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
