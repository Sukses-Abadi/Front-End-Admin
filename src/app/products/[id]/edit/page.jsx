import fetchWithTokenServer from "@/lib/fetchWithTokenServer";
import { redirect } from "next/navigation";
import EditProductForm from "@/components/EditProductForm";

export default async function Page({ params }) {
  const res = await fetchWithTokenServer("cms/category", "GET");
  if (res === "Unauthorized") {
    redirect("/logout");
  }

  const data = res.data;
  if (!data) return;

  return <EditProductForm params={params} />;
}
