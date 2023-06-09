import Navbar from "@/components/Navbar";
import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stripe Ecommerce",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
