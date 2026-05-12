"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifiedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("query");
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.14),transparent_30%),linear-gradient(180deg,#fffaf3_0%,#f8eedc_100%)] px-6 py-10 text-stone-900">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
        <Card className="w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-stone-950">Email verified</h1>
            <p className="mt-3 text-stone-600">
              Your account is ready. You can now sign in, complete booking, and access your QR ticket.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => router.push("/auth")}>Go to login</Button>
              <Button variant="outline" onClick={() => router.push("/booking")}>Open dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
