"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.push("/")}
      className="flex items-center gap-2 bg-[#0b0f19] border-gray-700 text-gray-200 hover:bg-yellow-400 hover:text-black transition rounded-full"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Home
    </Button>
  );
}
