import fetchWithTokenServer from "@/lib/fetchWithTokenServer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllProducts } from "@/fetch/products";

export default async function Home() {
  if (!cookies().get(`adminAccessToken`)) {
    redirect(`/login`);
  }
  const res = await fetchWithTokenServer(
    "cms/order?sortOrder=desc&status=&page=&limit=100&q=",
    "GET"
  );
  if (res === "Unauthorized") {
    redirect("/logout");
  }
  const data = res.data;
  const todayDate = new Date().toISOString().split("T")[0];
  const todayOrder = data.orders.filter((order) =>
    order.created_at.startsWith(todayDate)
  );
  const todayIncome = data.orders
    .filter((order) => order.created_at.startsWith(todayDate))
    .map((income) => income.total_price)
    .reduce((acc, currVal) => acc + currVal, 0);

  function formatCurrency(todayIncome) {
    if (todayIncome >= 1000000) {
      return (todayIncome / 1000000).toFixed(1) + "M";
    } else if (todayIncome >= 100000) {
      const thousands = Math.floor(todayIncome / 1000);
      return thousands + "K";
    } else {
      return todayIncome.toString();
    }
  }
  const resProducts = await fetchWithTokenServer(
    "cms/products?limit=100&page=1",
    "GET"
  );
  if (resProducts === "Unauthorized") {
    redirect("/logout");
  }

  const dataProducts = resProducts.data;
  return (
    <>
      <div
        className="hero min-h-screen bg-top"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        }}
      >
        <div className="hero-content flex flex-col lg:flex-row">
          <div className="md:relative bg-white bg-opacity-75 text-bold m-28 py-8 px-10 rounded-lg shadow-lg">
            <div className="lg:float-left lg:w-3/4">
              <h1 className="text-6xl font-bold">Together We Grow</h1>
              <p className="py-6">
                Sukses-Abadi stands for more than just success. it represents a
                timeless commitment to excellence. It symbolizes the unwavering
                pursuit of one&apos;s dreams and aspirations, crafting a legacy
                that will endure through the ages. Sukses-Abadi stands for
                innovation, determination, and the courage to take on new
                challenges.
              </p>
            </div>

            <div className="lg:flex-col lg:-right-3 lg:-top-12 lg:float-right lg:gap-0 lg:absolute md:flex-row md:gap-5 flex flex-col items-center mt-4">
              <Link href={"/order"}>
                <div className="bg-white hover:bg-gray-200 card w-52 h-24 mb-6 shadow-xl ">
                  <h2 className="items-center text-center font-semibold text-6xl">
                    {todayOrder.length}
                  </h2>
                  <p className="items-center text-center text-lg">
                    Total Orders Today
                  </p>
                </div>
              </Link>
              <Link href={"/order"}>
                <div className="bg-white hover:bg-gray-200  card w-52 h-24 mb-6 shadow-xl">
                  <h2 className="items-center text-center font-semibold text-6xl">
                    {formatCurrency(todayIncome)}
                  </h2>
                  <p className="items-center text-center text-lg">
                    Estimated Earnings Today
                  </p>
                </div>
              </Link>
              <Link href={"/products"}>
                <div className="bg-white hover:bg-gray-200  card w-52 h-24 mb-6 shadow-xl">
                  <h2 className="items-center text-center font-semibold text-6xl">
                    {dataProducts.products.length}
                  </h2>
                  <p className="items-center text-center text-lg">
                    Total Products
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
