// "use client";


// export default function Home() {




//   return (
//   <div className="bg-black min-h-screen flex items-center justify-center">
//     <div className="text-white text-center p-8">
//      <h1 className="text-4xl font-bold mb-4">Booking Closed</h1>
//      <p className="text-xl">We are currently not accepting any new bookings.</p>
//      <p className="mt-2">Please check back later.</p>
//     </div>
//   </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronRight, Clock3, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  "Cultural performances, devotional atmosphere, and well-managed seating",
  "Instant QR ticketing for faster entry and volunteer check-in",
  "Trustworthy registration flow with email verification and secure login",
];

const steps = [
  "Register or sign in with your verified college email.",
  "Complete the booking form and receive your booking confirmation.",
  "Show the QR ticket at the gate for fast verification and entry.",
];

const timeline = [
  { time: "10:00 AM", title: "Ganesh Pratishtpana Pooja" },
  { time: "06:00 PM", title: "Cultural Performances" },
  { time: "08:00 PM", title: "Dinner Service" },
  { time: "10:00 PM", title: "Ganesh Visarjana" },
];

const contacts = [
  { name: "Aravind KT", phone: "9141644060", role: "Volunteer lead" },
  { name: "Shathadru", phone: "8660059031", role: "Registration support" },
];

export default function Home() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen text-stone-900">
      <Navbar onMenuClick={() => setIsOpen(true)} />

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-stone-950/85 p-4 backdrop-blur-sm md:hidden">
          <div className="mx-auto flex max-w-sm flex-col rounded-3xl border border-white/10 bg-stone-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">Menu</p>
              <button className="text-sm text-stone-300" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-3 text-lg">
              <a href="#about" onClick={() => setIsOpen(false)}>About</a>
              <a href="#highlights" onClick={() => setIsOpen(false)}>Highlights</a>
              <a href="#steps" onClick={() => setIsOpen(false)}>Booking steps</a>
              <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
            </div>
            <div className="mt-8 grid gap-3">
              <Button onClick={() => { setIsOpen(false); router.push("/auth"); }}>Login / Register</Button>
              <Button variant="outline" onClick={() => { setIsOpen(false); router.push("/booking"); }}>My Booking</Button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(127,29,29,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(217,119,6,0.18),transparent_30%),linear-gradient(180deg,#fffaf3_0%,#fff5e8_45%,#f4ead6_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-900/10 bg-white/75 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Kannada Balaga IIT Kanpur Fest Booking Portal
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
              A premium, student-friendly portal for fest registration and QR entry.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
              Register for the Kannada Balaga event, manage your booking securely, and present a clean QR ticket at the gate. Built for students, volunteers, and admins.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => router.push("/auth")}>
                Register now <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/booking")}>
                View my booking
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-5">
                  <CalendarDays className="h-5 w-5 text-amber-800" />
                  <p className="mt-3 text-sm font-medium text-stone-500">Date</p>
                  <p className="mt-1 text-lg font-semibold text-stone-950">6 September</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <MapPin className="h-5 w-5 text-amber-800" />
                  <p className="mt-3 text-sm font-medium text-stone-500">Venue</p>
                  <p className="mt-1 text-lg font-semibold text-stone-950">Aashiyana Hall</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <Clock3 className="h-5 w-5 text-amber-800" />
                  <p className="mt-3 text-sm font-medium text-stone-500">Status</p>
                  <p className="mt-1 text-lg font-semibold text-stone-950">Registration portal</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-xl rounded-[2rem] border border-amber-900/10 bg-stone-950 p-6 text-white shadow-[0_24px_80px_rgba(29,22,15,0.3)]">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200">Ticket preview</p>
                  <p className="mt-1 text-lg font-semibold">Kannada Balaga Night Pass</p>
                </div>
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_140px]">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#2c1711] to-[#0f1720] p-5">
                  <p className="text-sm text-stone-300">What you get</p>
                  <div className="mt-4 space-y-3 text-sm text-stone-200">
                    {highlights.map((item) => (
                      <p key={item} className="rounded-2xl bg-white/5 px-4 py-3">{item}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-dashed border-white/20 bg-white p-4 text-stone-950">
                  <div className="grid grid-cols-7 gap-1 opacity-90">
                    {Array.from({ length: 49 }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-3 w-3 rounded-[3px] ${index % 3 === 0 || index % 5 === 0 ? "bg-stone-900" : "bg-stone-200"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">QR ticket area</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">About the event</p>
              <h2 className="mt-3 text-3xl font-semibold text-stone-950">A celebration of culture, discipline, and campus community.</h2>
              <p className="mt-4 max-w-3xl text-stone-600 leading-7">
                This portal is designed to make fest registration simple, trustworthy, and visually clear. Students can register quickly, volunteers can verify entries efficiently, and admins can manage bookings without ambiguity.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">Event snapshot</p>
              <div className="mt-4 space-y-3 text-sm text-stone-600">
                <p><span className="font-medium text-stone-950">Date:</span> 6 September</p>
                <p><span className="font-medium text-stone-950">Venue:</span> Aashiyana Hall, New Shopping Complex</p>
                <p><span className="font-medium text-stone-950">Audience:</span> IIT Kanpur students, volunteers, and guests</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="highlights" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Why register", text: "Get instant booking confirmation, a clean QR ticket, and easy access to check-in support." },
            { title: "Event highlights", text: "Cultural performances, devotional setup, dinner service, and a professionally managed entry flow." },
            { title: "Trust and safety", text: "Email verification, secure login, and protected booking and admin pathways." },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-stone-950">{item.title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="steps" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">Booking steps</p>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="rounded-3xl border border-amber-950/10 bg-white/70 p-6">
                  <p className="text-sm font-semibold text-amber-800">Step {index + 1}</p>
                  <p className="mt-3 text-stone-700 leading-7">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Card>
          <CardContent className="p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">Events timeline</p>
            <div className="mt-6 space-y-4">
              {timeline.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-amber-950/10 bg-white/70 px-4 py-4">
                  <div className="min-w-24 text-sm font-semibold text-amber-800">{item.time}</div>
                  <div className="font-medium text-stone-800">{item.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card id="contact">
          <CardContent className="p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">Contact / help</p>
            <div className="mt-6 space-y-4">
              {contacts.map((contact) => (
                <div key={contact.name} className="rounded-2xl border border-amber-950/10 bg-white/70 p-5">
                  <p className="font-semibold text-stone-950">{contact.name}</p>
                  <p className="mt-1 text-sm text-stone-600">{contact.role}</p>
                  <p className="mt-2 text-sm text-stone-700">{contact.phone}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Card className="bg-stone-950 text-white">
          <CardContent className="flex flex-col gap-4 p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-amber-200">Ready to register?</p>
              <h2 className="mt-2 text-2xl font-semibold">Open your account and get your booking started.</h2>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => router.push("/auth")}>Login / Register</Button>
              <Button variant="outline" onClick={() => router.push("/adminauth")}>Admin login</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
