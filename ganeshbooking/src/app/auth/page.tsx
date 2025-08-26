"use client";

import BackButton from "@/components/ui/back";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
const router=useRouter();
  // Form states
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

type Pay = {
  email: string;
  name?: string;
  roll?: string;
};


    try {
      const payload: Pay  = { email };
      if (mode === "signup") {
        payload.name = name;
        payload.roll = roll;
   
      }
      if (mode === "signin") {
        // payload.password = password;
      }

      const endpoint =
        mode === "signin"
          ? `${process.env.NEXT_PUBLIC_USER_API_URL}/signin`
          : `${process.env.NEXT_PUBLIC_USER_API_URL}/signup`;
   
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      localStorage.setItem("authToken", data.token);


      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (mode === "signin") {
        // store token in localStorage
  
 
        setEmail("")
        setName("")
        // setPassword("")
        setRoll("")
        setMessage("Login successful!");
        router.push("/booking")
      } else {
         setMessage("Signup successful!");
         router.push("/booking")
      }
    } catch (err: unknown) {
          if (mode === "signin") {setMessage("Record Not found")}
          else{
      setMessage("sign up failed , Please try again");}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] p-2">
      <BackButton />
      <main className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-[#101522] rounded-2xl shadow-lg p-8 relative z-10">
          
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            {mode === "signin"
              ? "Welcome Back"
              : mode === "signup"
              ? "Create an Account"
              : "Reset Password"}
          </h1>

          {message && (
            <p className="mb-4 text-center text-yellow-400">{message}</p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 rounded-lg bg-[#0b0f19] border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Rollnumber
                  </label>
                  <input
                    type="text"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                    placeholder="Enter your rollnumber"
                    className="w-full px-4 py-2 rounded-lg bg-[#0b0f19] border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm mb-1 text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-[#0b0f19] border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                required
              />
            </div>
              {mode === "signup" && (
              <div className="mt-3 p-3 rounded-lg bg-[#1a1f2e] border border-yellow-500 text-sm text-yellow-300">
                <p>
                  ℹ️ Your email will be used to send <span className="font-semibold">coupons </span> 
                  and also for future <span className="font-semibold">sign-in</span>. 
                  Please enter a valid email.
                </p>
              </div>
            )}

            {mode !== "forgot" && (
              <div>
                {/* <label className="block text-sm mb-1 text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-lg bg-[#0b0f19] border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                  required
                /> */}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                ? "Sign In"
                : mode === "signup"
                ? "Sign Up"
                : "Send Reset Link"}
            </button>
          </form>

          {/* Toggle links */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {mode === "signin" && (
              <>
                <p>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="text-yellow-400 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
        
              </>
            )}
            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-yellow-400 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
