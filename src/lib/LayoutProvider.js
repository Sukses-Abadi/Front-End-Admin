"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export const LayoutProvider = ({ children }) => {
  const pathname = usePathname();
  const excludedPaths = ["/login", "/register"];
  const showNavbar = !excludedPaths.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};
