import fetchWithTokenServer from "@/lib/fetchWithTokenServer";
import Table from "./components/Table";
import { getCookies } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Page() {
  if (!cookies().get(`accessToken`)) {
    redirect(`/login`);
  }
  // console.log("page server");
  const res = await fetchWithTokenServer("cms/order", "GET");
  if (res === "Unauthorized") {
    redirect("/logout");
  }
  const data = res.data;
  if (!data) return;
  return <Table />;
}
