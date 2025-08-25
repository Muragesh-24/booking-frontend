// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProtectedAdminRoute from "@/components/ui/adminprotector";

// Types
interface Booking {
  id: number;
  name: string;
  email: string;
  utr: string;
  kannadigas: number;
  nonKannadigas: number;
  total: number;
  createdAt: string;
  status: string;
  statuscount:number;
  is_verified: boolean;
}

export default function AdminPage() {
  const [users, setUsers] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUtr, setSelectedUtr] = useState<string | null>(null);

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
      setUsers(json.data);
      setStats({
        total: json.total,
        pendingVerify: json.pendingVerify,
        totalEntered: json.totalEntered,
        totalCoupans: json.totalcoupons,
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

  // Update helpers
  const handleEntered = async (utr: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utr, action: "entered" }),
      });

      // update state locally
      setUsers((prev) =>
        prev.map((u) =>
          u.utr === utr ? { ...u, status: "Present" } : u
        )
      );
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

      // update state locally
      setUsers((prev) =>
        prev.map((u) =>
          u.utr === utr ? { ...u, is_verified: true } : u
        )
      );
    } catch (err) {
      console.error("Error marking verified:", err);
    }
  };

  return (
    <ProtectedAdminRoute>
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Side</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-lg font-semibold">Total Coupons</p>
            <p className="text-2xl">{stats.totalCoupans}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-lg font-semibold">Total Bookings</p>
            <p className="text-2xl">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-lg font-semibold">Pending Verification</p>
            <p className="text-2xl">{stats.pendingVerify}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-lg font-semibold">Total Entered</p>
            <p className="text-2xl">{stats.totalEntered}</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      {selectedUtr && (
        <Dialog open={!!selectedUtr} onOpenChange={() => setSelectedUtr(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Booking</DialogTitle>
              <DialogDescription>UTR: {selectedUtr}</DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 mt-4">
              <Button
                className="flex-1"
                onClick={() => {
                  handleEntered(selectedUtr);
                  setSelectedUtr(null);
                }}
              >
                Entered
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => {
                  handleVerified(selectedUtr);
                  setSelectedUtr(null);
                }}
              >
                Verified
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Table Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">List of Registered People</h2>
          <Button onClick={fetchUsers} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>UTR Number</TableHead>
              <TableHead>Kannadigas</TableHead>
              <TableHead>Non-Kannadigas</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>StatusCount</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  {loading ? "Loading..." : "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.utr}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.utr}</TableCell>
                  <TableCell>{user.kannadigas}</TableCell>
                  <TableCell>{user.nonKannadigas}</TableCell>
                  <TableCell>{user.total}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{user.status}</TableCell>
                <TableCell>
  <div className="flex items-center gap-2">
    <button
      className="px-2 py-1 border rounded disabled:opacity-50"
      onClick={() =>
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id && u.statuscount > 0
              ? { ...u, statuscount: u.statuscount - 1 }
              : u
          )
        )
      }
      disabled={user.statuscount <= 0}
    >
      –
    </button>

    <span>
      {user.statuscount}/{user.kannadigas + user.nonKannadigas}
    </span>

    <button
      className="px-2 py-1 border rounded disabled:opacity-50"
      onClick={() =>
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id &&
            u.statuscount < u.kannadigas + u.nonKannadigas
              ? { ...u, statuscount: u.statuscount + 1 }
              : u
          )
        )
      }
      disabled={user.statuscount >= user.kannadigas + user.nonKannadigas}
    >
      +
    </button>

    {/* Save button */}
    <button
      className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
      onClick={async () => {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/statuscount/${user.utr}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ statuscount: user.statuscount }),
          });
        } catch (err) {
          console.error("Failed to save", err);
        }
      }}
    >
      Save
    </button>
  </div>
</TableCell>

                  <TableCell>
                    {user.is_verified ? "Verified" : "Pending"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUtr(user.utr)}
                    >
                      Action
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </ProtectedAdminRoute>
  );
}
