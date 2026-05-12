"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

type NavbarProps = {
  onMenuClick?: () => void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-amber-950/8 bg-[#fff8f0]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8f1d1d] via-[#b45309] to-[#d97706] text-sm font-bold text-white shadow-lg shadow-amber-950/10">
            KB
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">Kannada Balaga</p>
            <p className="text-sm text-stone-600">IIT Kanpur Fest Portal</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/#about">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/auth">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth">Register</Link>
          </Button>
        </nav>

        <Button variant="outline" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </div>
    </header>
  );
}