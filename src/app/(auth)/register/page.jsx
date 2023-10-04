"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/fetch/auth";
import Swal from "sweetalert2";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await register({ username, password });

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have successfully registered an account.",
        showConfirmButton: false,
        timer: 2000,
      });

      router.push("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Oops! Something went wrong during registration.",
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
            Sign Up
          </h1>
          <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
            Create an admin account for enhanced privileges.
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
            Sign Up
          </button>
          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <a className="text-blue-600 underline cursor-pointer" href="/login">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
