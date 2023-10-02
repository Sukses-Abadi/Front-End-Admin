import "./globals.css";
import { Inter } from "next/font/google";
import { LayoutProvider } from "@/lib/LayoutProvider";

export const metadata = {
  title: "Sukses Abadi Admin Dashboard",
  description: "Sukses Abadi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FEF9F9]">
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
