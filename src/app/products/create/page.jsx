import fetchWithTokenServer from "@/lib/fetchWithTokenServer";
import { redirect } from "next/navigation";
import CreateProductForm from "@/components/CreateProductForm";

export default async function Page() {
  const res = await fetchWithTokenServer("cms/category", "GET");
  if (res === "Unauthorized") {
    redirect("/logout");
  }

  const data = res.data;
  if (!data) return;

  return <CreateProductForm />;
}
