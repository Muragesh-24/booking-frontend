"use client";

import BackButton from "@/components/ui/back";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          theme?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      remove?: (widgetId: number) => void;
      reset?: (widgetId?: number) => void;
    };
  }
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");
const CAPTCHA_ENABLED = process.env.NEXT_PUBLIC_CAPTCHA_ENABLED === "true";
const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || "";

type ApiResponse = {
  error?: string;
  message?: string;
  token?: string;
};

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const router = useRouter();
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaScriptReady, setCaptchaScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    setCaptchaToken("");
    setError("");
    if (widgetIdRef.current !== null && window.turnstile?.reset) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [mode]);

  useEffect(() => {
    if (!CAPTCHA_ENABLED || !captchaScriptReady || !captchaContainerRef.current || !window.turnstile) {
      return;
    }

    const container = captchaContainerRef.current;
    container.innerHTML = "";

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: CAPTCHA_SITE_KEY,
      theme: "light",
      callback: (token: string) => {
        setCaptchaToken(token);
        setError("");
      },
      "expired-callback": () => {
        setCaptchaToken("");
      },
      "error-callback": () => {
        setCaptchaToken("");
        setError("CAPTCHA could not be loaded. Please refresh the page and try again.");
      },
    });

    return () => {
      if (widgetIdRef.current !== null && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [captchaScriptReady, mode]);

  const getEndpoint = () => `${API_URL}/user/${mode === "signin" ? "signin" : "signup"}`;

  const readResponse = async (res: Response): Promise<ApiResponse> => {
    const text = await res.text();
    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text) as ApiResponse;
    } catch {
      return { message: text };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (mode === "forgot") {
      setError("Password reset is not wired in this build yet.");
      setLoading(false);
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (CAPTCHA_ENABLED && !captchaToken) {
      setError("Please complete the CAPTCHA challenge before continuing.");
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, string> = {
        email,
        captchaToken,
        captcha: captchaToken,
      };

      if (mode === "signup") {
        payload.name = name;
        payload.roll = roll;
        payload.phone = phone;
        payload.college = college;
        payload.password = password;
      }

      if (mode === "signin") {
        payload.password = password;
      }

      const res = await fetch(getEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(res);
      if (!res.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      setCaptchaToken("");

      if (mode === "signin") {
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setRoll("");
        setPhone("");
        setCollege("");
        setMessage("Login successful. Redirecting to your dashboard.");
        router.push("/booking");
      } else {
        setMessage("Signup successful. Please verify your email before booking.");
        router.push("/auth/verified");
      }
    } catch (err: unknown) {
      if (err instanceof TypeError) {
        setError("Backend is offline or unreachable. Start it on http://localhost:8080 and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Request failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.14),transparent_30%),linear-gradient(180deg,#fffaf3_0%,#f8eedc_100%)] p-2 text-stone-900">
      <BackButton />
      {CAPTCHA_ENABLED ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setCaptchaScriptReady(true)}
        />
      ) : null}
      <main className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="flex flex-col justify-center rounded-[2rem] bg-stone-950 p-8 text-white shadow-[0_24px_80px_rgba(29,22,15,0.26)] lg:p-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-amber-200">
              <Sparkles className="h-4 w-4" /> Secure access for students and volunteers
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-stone-300">
              Use your verified email to access booking, QR tickets, and event updates. The auth form now talks to the shared API base and can require CAPTCHA when enabled.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <p className="mt-3 text-sm text-stone-300">Email verification blocks unconfirmed accounts from booking.</p>
              </div>
         
            </div>
          </section>

          <Card className="border-amber-950/10 bg-white/85">
            <CardHeader>
              <CardTitle className="text-2xl">
                {mode === "signin" ? "Sign in" : mode === "signup" ? "Register" : "Password recovery"}
              </CardTitle>
              <CardDescription>
                {mode === "signin"
                  ? "Access your dashboard and QR ticket."
                  : mode === "signup"
                  ? "Register with your contact details and verify your email."
                  : "Request a reset link for your account."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                {message ? (
                  <Alert>
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                ) : null}
                {error ? (
                  <Alert className="border-rose-200 bg-rose-50 text-rose-900">
                    <AlertTitle>Action required</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                {mode === "signup" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" required />
                    </div>
                    <div>
                      <Label htmlFor="roll">Roll / ID</Label>
                      <Input id="roll" value={roll} onChange={(e) => setRoll(e.target.value)} placeholder="Roll number or college ID" required />
                    </div>
                    <div>
                      <Label htmlFor="college">College</Label>
                      <Input id="college" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="College or department" />
                    </div>
                  </div>
                ) : null}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@iitk.ac.in" required />
                </div>

                {mode !== "forgot" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
                    </div>
                    {mode === "signup" ? (
                      <div>
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" required />
                      </div>
                    ) : null}
                  </div>
                ) : null}

    
           

                {CAPTCHA_ENABLED ? (
                  <div className="space-y-2">
                    <Label>CAPTCHA</Label>
                    {!CAPTCHA_SITE_KEY ? (
                      <p className="text-sm text-rose-700">Set NEXT_PUBLIC_CAPTCHA_SITE_KEY in .env.local before enabling CAPTCHA.</p>
                    ) : null}
                    <div ref={captchaContainerRef} className="min-h-[78px] rounded-xl border border-stone-200 bg-white p-3" />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
               This project is currently hosted on Render while the EC2 instance is temporarily off. Email verification and CAPTCHA are disabled for easy testing, but all core features are available for review.
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading
                    ? "Please wait..."
                    : mode === "signin"
                    ? "Sign in"
                    : mode === "signup"
                    ? "Create account"
                    : "Send reset link"}
                </Button>
              </form>

              <div className="mt-6 flex flex-col gap-3 text-sm text-stone-600">
                <div className="flex flex-wrap gap-2">
                  <button className="font-medium text-amber-800 hover:underline" onClick={() => setMode("signin")} type="button">
                    Sign in
                  </button>
                  <span>•</span>
                  <button className="font-medium text-amber-800 hover:underline" onClick={() => setMode("signup")} type="button">
                    Register
                  </button>
                  <span>•</span>
                  <button className="font-medium text-amber-800 hover:underline" onClick={() => setMode("forgot")} type="button">
                    Forgot password
                  </button>
                </div>
                <p>Need help? Contact the volunteer desk after verifying your email.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
