import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-amber-950/10 bg-stone-950 text-stone-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">Kannada Balaga IIT Kanpur</p>
          <p className="mt-3 max-w-md text-sm text-stone-300">
            A clean, secure, and student-friendly portal for fest registration, QR ticketing, and volunteer check-ins.
          </p>
        </div>
        <div className="text-sm text-stone-300">
          <p className="font-semibold text-white">Quick Links</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/auth">Login / Register</Link>
            <Link href="/booking">My Booking</Link>
            <Link href="/adminauth">Admin Login</Link>
          </div>
        </div>
        <div className="text-sm text-stone-300">
          <p className="font-semibold text-white">Help</p>
          <p className="mt-3">For registration or entry issues, contact the Kannada Balaga volunteer desk during the event.</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-stone-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Kannada Balaga IIT Kanpur. All rights reserved.
      </div>
    </footer>
  );
}