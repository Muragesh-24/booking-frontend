"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Mail, PlusCircle, ShieldCheck, UserCircle2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Toaster, toast } from "sonner";

import BackButton from "@/components/ui/back";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import ProtectedRoute from "@/components/ui/protector";


type Booking = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  utr: string;
  kannadigas?: number;
  nonKannadigas?: number;
  total: number;
  status: string;
  is_verified: boolean;
  createdAt: string;
};
export default function BookingPage() {
  const [bookings, setBookings] = useState<{ coupons: Booking[] }>({ coupons: [] });
  const [loading, setLoading] = useState(true);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingUtr, setBookingUtr] = useState("");
  const [kannadigas, setKannadigas] = useState(1);
  const [nonKannadigas, setNonKannadigas] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const pricePerTicket = 350;
  const total = Math.max(0, kannadigas) * pricePerTicket + Math.max(0, nonKannadigas) * pricePerTicket;
  const allBookings = bookings.coupons;
  const latestBooking = allBookings[0];

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_USER_API_URL}/mybooking`,
        {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      setBookings({ coupons: data.data || [] });

      const latest = (data.data || [])[0];
      if (latest) {
        setBookingName(latest.name || "");
        setBookingPhone(latest.phone || "");
        setBookingUtr(latest.utr || "");
        setKannadigas(Number.isFinite(latest.kannadigas) ? latest.kannadigas : 1);
        setNonKannadigas(Number.isFinite(latest.nonKannadigas) ? latest.nonKannadigas : 0);
      }

    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

 useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleBookTicket = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_USER_API_URL}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: bookingName,
          phone: bookingPhone,
          utr: bookingUtr,
          kannadigas,
          nonKannadigas,
          total,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to book ticket");
      }

      toast.success("Ticket booked successfully");
      await fetchBookings();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Booking failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <ProtectedRoute>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.12),transparent_32%),linear-gradient(180deg,#fffaf3_0%,#f8eedc_100%)] text-stone-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <BackButton />
        </div>
        <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">User dashboard</CardTitle>
                <CardDescription>
                  Track your booking, ticket status, and gate verification here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-3xl border border-amber-950/10 bg-white/70 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
                      <UserCircle2 className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">Signed in user</p>
                      <p className="text-lg font-semibold text-stone-950">{latestBooking?.name || "Guest user"}</p>
                      <p className="text-sm text-stone-600">{latestBooking?.email || "No booking loaded yet"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-sm text-stone-500">Booking status</p>
                    <p className="mt-2 text-lg font-semibold">
                      {allBookings.length > 0 ? `${allBookings.length} booking${allBookings.length > 1 ? "s" : ""}` : loading ? "Loading..." : "No booking yet"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-sm text-stone-500">Verification</p>
                    <p className="mt-2 text-lg font-semibold">{latestBooking?.is_verified ? "Verified" : "Pending"}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-dashed border-amber-950/15 bg-amber-50/60 p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-700" />
                    <p className="text-sm font-medium text-stone-700">Only verified users can book and access ticket details. Reuse your latest booking form below to create a ticket.</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-amber-950/10 bg-white/70 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <PlusCircle className="h-5 w-5 text-amber-800" />
                    <div>
                      <p className="text-sm font-semibold text-stone-950">Book a ticket</p>
                      <p className="text-xs text-stone-500">Submit your booking details and generate a fresh QR ticket.</p>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={handleBookTicket}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-stone-600">Name</label>
                        <input
                          className="h-11 w-full rounded-xl border border-amber-950/10 bg-white/85 px-4 shadow-sm outline-none"
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-stone-600">Phone</label>
                        <input
                          className="h-11 w-full rounded-xl border border-amber-950/10 bg-white/85 px-4 shadow-sm outline-none"
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="Mobile number"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-stone-600">UTR / payment reference</label>
                        <input
                          className="h-11 w-full rounded-xl border border-amber-950/10 bg-white/85 px-4 shadow-sm outline-none"
                          value={bookingUtr}
                          onChange={(e) => setBookingUtr(e.target.value)}
                          placeholder="Transaction / UTR number"
                          required
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-stone-600">Kannadigas</label>
                          <input
                            type="number"
                            min={0}
                            className="h-11 w-full rounded-xl border border-amber-950/10 bg-white/85 px-4 shadow-sm outline-none"
                            value={kannadigas}
                            onChange={(e) => setKannadigas(Number(e.target.value))}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-stone-600">Non-Kannadigas</label>
                          <input
                            type="number"
                            min={0}
                            className="h-11 w-full rounded-xl border border-amber-950/10 bg-white/85 px-4 shadow-sm outline-none"
                            value={nonKannadigas}
                            onChange={(e) => setNonKannadigas(Number(e.target.value))}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-dashed border-amber-950/15 bg-amber-50/70 px-4 py-3 text-sm text-stone-700">
                      Total: <span className="font-semibold text-stone-950">₹{total}</span> at ₹{pricePerTicket} per ticket
                    </div>

                    <Button className="w-full" type="submit" disabled={submitting}>
                      {submitting ? "Booking ticket..." : "Book ticket"}
                    </Button>
                  </form>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => toast.success("Ticket emailed if email delivery is enabled.") }>
                    <Mail className="h-4 w-4" /> Email ticket
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("Download prepared when QR export is wired.") }>
                    <Download className="h-4 w-4" /> Download ticket
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>QR ticket</CardTitle>
                  <CardDescription>Your entry pass for the event gate.</CardDescription>
                </CardHeader>
                <CardContent>
                  {allBookings.length > 0 ? (
                    <div className="rounded-[2rem] border border-amber-950/10 bg-stone-950 p-6 text-white shadow-[0_18px_50px_rgba(29,22,15,0.2)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Event pass</p>
                          <h3 className="mt-2 text-2xl font-semibold">Kannada Balaga Night</h3>
                          <p className="mt-2 text-sm text-stone-300">{allBookings.length} booking{allBookings.length > 1 ? "s" : ""} found</p>
                        </div>
                        <Badge variant={latestBooking?.is_verified ? "success" : "warning"}>{latestBooking?.is_verified ? "Verified" : "Pending"}</Badge>
                      </div>

                      <div className="mt-6 space-y-4">
                        {allBookings.map((booking) => (
                          <div key={booking.utr || booking.id} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:grid-cols-[1fr_150px]">
                            <div className="space-y-3 text-sm text-stone-200">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-semibold text-white">{booking.name}</p>
                                <Badge variant={booking.is_verified ? "success" : "warning"}>{booking.is_verified ? "Verified" : "Pending"}</Badge>
                              </div>
                              <p><span className="text-stone-400">Booking ID:</span> {booking.utr || booking.id}</p>
                              <p><span className="text-stone-400">Check-in:</span> {booking.status}</p>
                              <p><span className="text-stone-400">Tickets:</span> {booking.total}</p>
                              <p><span className="text-stone-400">Created:</span> {new Date(booking.createdAt).toLocaleString()}</p>
                            </div>

                            <div className="rounded-3xl bg-white p-4 text-stone-950">
                              <QRCodeCanvas
                                value={booking.utr || String(booking.id)}
                                size={120}
                                includeMargin
                                className="mx-auto h-auto w-full max-w-[120px]"
                              />
                              <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">QR code</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : loading ? (
                    <div className="rounded-3xl border border-dashed border-amber-950/15 p-10 text-center text-stone-600">Loading your booking information...</div>
                  ) : (
                    <EmptyState
                      title="No booking found"
                      description="Your account does not have a confirmed booking yet. Complete registration or contact support if this looks incorrect."
                      actionLabel="Go to login"
                      onAction={() => router.push("/auth")}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need help?</CardTitle>
                  <CardDescription>Keep your booking details ready and contact support if something looks wrong.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-stone-600">
                  <p>The QR scanner is available only on the admin side for volunteer check-in.</p>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/auth") }>
                    Return to login
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
