"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Filter, ScanLine, ShieldCheck, Ticket, Users } from "lucide-react";

import ProtectedAdminRoute from "@/components/ui/adminprotector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Booking = {
  id: number;
  name: string;
  email: string;
  utr: string;
  kannadigas: number;
  nonKannadigas: number;
  total: number;
  createdAt: string;
  status: string;
  statuscount: number;
  is_verified: boolean;
};

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [stats, setStats] = useState({
    total: 0,
    pendingVerify: 0,
    totalEntered: 0,
    totalCoupans: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/`);
      const json = await res.json();
      const sortedData = [...(json.data || [])].sort((a: Booking, b: Booking) => b.id - a.id);
      setUsers(sortedData);
      setStats({
        total: json.total || 0,
        pendingVerify: json.pendingVerify || 0,
        totalEntered: json.totalEntered || 0,
        totalCoupans: json.totalcoupons || 0,
      });
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEntered = async (utr: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utr, action: "entered" }),
      });
      setUsers((prev) => prev.map((u) => (u.utr === utr ? { ...u, status: "Present" } : u)));
    } catch (err) {
      console.error("Error marking entered:", err);
    }
  };

  const handleVerified = async (utr: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/verifybook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utr, action: "verified" }),
      });
      setUsers((prev) => prev.map((u) => (u.utr === utr ? { ...u, is_verified: true } : u)));
    } catch (err) {
      console.error("Error marking verified:", err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.utr.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && u.is_verified) ||
        (statusFilter === "pending" && !u.is_verified) ||
        (statusFilter === "present" && u.status.toLowerCase() === "present");
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.12),transparent_32%),linear-gradient(180deg,#fffaf3_0%,#f8eedc_100%)] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-[2rem] bg-stone-950 px-6 py-8 text-white shadow-[0_24px_80px_rgba(29,22,15,0.26)]">
            <p className="text-sm uppercase tracking-[0.28em] text-amber-200">Admin panel</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Kannada Balaga booking operations</h1>
            <p className="mt-4 max-w-3xl text-stone-300">
              Monitor registrations, verify bookings, manage check-ins, and keep the event entry flow organized.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => router.push("/scanner")}>
                <ScanLine className="h-4 w-4" /> Open scanner
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>Back to site</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard label="Total registrations" value={stats.total} badge="All users" />
            <StatsCard label="Total bookings" value={stats.totalCoupans} badge="Bookings" />
            <StatsCard label="Pending verification" value={stats.pendingVerify} badge="Review" />
            <StatsCard label="Checked in" value={stats.totalEntered} badge="Gate" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Search and filters</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-600">Search bookings</label>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, email, or UTR"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-600">Status filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 rounded-xl border border-amber-950/10 bg-white/85 px-4 text-sm shadow-sm outline-none"
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="present">Present</option>
                </select>
              </div>
              <Button onClick={fetchUsers} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh data"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-2xl">Bookings table</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => window.print()}>
                    <Download className="h-4 w-4" /> Export CSV
                  </Button>
                  <Button variant="outline">
                    <Filter className="h-4 w-4" /> Quick filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <EmptyState
                  title={loading ? "Loading bookings" : "No bookings found"}
                  description={loading ? "Please wait while the admin list loads." : "Try a different search or filter."}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>UTR</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.utr}>
                        <TableCell>
                          <div className="font-medium text-stone-950">{user.name}</div>
                          <div className="text-xs text-stone-500">{user.id}</div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="font-mono text-xs">{user.utr}</TableCell>
                        <TableCell>{user.total}</TableCell>
                        <TableCell>
                          <Badge variant={user.is_verified ? "success" : "warning"}>
                            {user.is_verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status.toLowerCase() === "present" ? "success" : "outline"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleVerified(user.utr)}>
                              <ShieldCheck className="h-4 w-4" /> Verify
                            </Button>
                            <Button size="sm" onClick={() => handleEntered(user.utr)}>
                              <Ticket className="h-4 w-4" /> Check in
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Volunteer notes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-amber-950/10 bg-white/70 p-5">
                <Users className="h-5 w-5 text-amber-800" />
                <p className="mt-3 font-medium">Search before manual actions</p>
              </div>
              <div className="rounded-3xl border border-amber-950/10 bg-white/70 p-5">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                <p className="mt-3 font-medium">Mark entry only after QR verification</p>
              </div>
              <div className="rounded-3xl border border-amber-950/10 bg-white/70 p-5">
                <Ticket className="h-5 w-5 text-stone-700" />
                <p className="mt-3 font-medium">Keep the check-in desk responsive on mobile</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
