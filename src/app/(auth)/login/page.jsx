"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/fetch/auth";
import Swal from "sweetalert2";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await login({ username, password });

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have successfully logged in to your account.",
        showConfirmButton: false,
        timer: 2000,
      });
      router.refresh();
      router.push("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid username or password. Please try again.",
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
        <div>
          <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
            Sign In
          </h1>
          <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
            Log in as an admin to access the admin dashboard.
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="text-center mt-6">
          <button
            className="py-3 w-60 text-xl text-white font-semibold bg-red-400 rounded-2xl"
            onClick={handleSubmit}
          >
            Sign In
          </button>
          <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <a
              className="text-blue-600 underline cursor-pointer"
              href="/register"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
