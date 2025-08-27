"use client";

import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Toaster, toast } from "sonner"
import BackButton from "@/components/ui/back";
import ProtectedRoute from "@/components/ui/protector";


type Booking = {
 id: number;
 utr: string;
 name: string;
 email: string;
 total: number;
 status: string;
 is_verified : boolean;
 createdAt: string;
};
export default function BookingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [utr, setUtr] = useState("");
  const [kannadigas, setKannadigas] = useState(0);
  const [nonKannadigas, setNonKannadigas] = useState(0);
  const  [isalert,setIsalert]=useState(false)
  const[aleartmsg,setAlearmsg]=useState("")

  const [bookings, setBookings] = useState<{ coupons: Booking[] }>({ coupons: [] });

  const priceKannadiga = 350;
  const priceNonKannadiga = 350;
  
let nonKannadigaTotal = 0;

if (nonKannadigas < 2) {
  nonKannadigaTotal = nonKannadigas * priceNonKannadiga * 0.1;
} else if (nonKannadigas <= 4) {
  nonKannadigaTotal = nonKannadigas * priceNonKannadiga * 0.8;
} else {
  nonKannadigaTotal = nonKannadigas * priceNonKannadiga * 0.7;
}

const total = kannadigas * priceKannadiga + nonKannadigaTotal;


  

  const router =useRouter ()
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("authToken"); // no need to await
      if (!token) {
        console.warn("No auth token found");
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

    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

 useEffect(() => {


  fetchBookings();
}, []);


    const pushOrder = async () => {
    const token = await localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth");
      return;
    }


    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_USER_API_URL}/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            utr,
            kannadigas,
            nonKannadigas,
            total,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const data = await res.json();
  
 toast.success("Order placed successfully!")
 fetchBookings();
   
    } catch (err) {
      console.error(err);
      
      //  toast({
      //     title: "Failed to place order",
      //     description: "Try again.",
      //     variant: "destructive",
      //   })
      toast.error("Failed to place order")
    }
  };

  return (
    <ProtectedRoute>
    <div className=" bg-[#0b0f19] p-2">
        <BackButton/>
    <main className="min-h-screen  flex items-center justify-center px-4 py-10">
     <Toaster position="bottom-right" richColors />
      <Card className="w-full max-w-2xl bg-[#101522] border border-gray-700 rounded-2xl shadow-lg text-white">
    <CardHeader className="text-center">
  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
    Book Your Spot
  </CardTitle>
  <p className="mt-2 text-gray-400">
    Per Coupon: <span className="text-yellow-400 font-semibold">₹350</span>
  </p>

  <div className="mt-2 text-gray-400">
    <p className="font-semibold">Non-Kannadiga Discounts:</p>
    <ul className="list-disc list-inside space-y-1">
      <li>1 Coupon: 10% off</li>
      <li>2-4 Coupons: 20% off</li>
      <li>5 or more Coupons: 30% off</li>
    </ul>
  </div>
</CardHeader>


        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-yellow-400">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0b0f19] border-gray-700 focus:ring-yellow-400"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-yellow-400">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0b0f19] border-gray-700 focus:ring-yellow-400"
            />
          </div>

          {/* UTR */}
         

          {/* Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="kannadigas" className="text-yellow-400">Number of Kannadigas</Label>
              <Input
                id="kannadigas"
                type="number"
                min="0"
                value={kannadigas}
                onChange={(e) => setKannadigas(Number(e.target.value))}
                className="bg-[#0b0f19] border-gray-700 focus:ring-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nonKannadigas" className="text-yellow-400">Number of Non-Kannadigas</Label>
              <Input
                id="nonKannadigas"
                type="number"
                min="0"
                value={nonKannadigas}
                onChange={(e) => setNonKannadigas(Number(e.target.value))}
                className="bg-[#0b0f19] border-gray-700 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Total + UPI Info */}
          <div className="bg-[#0f172a] border border-yellow-500 rounded-xl p-4 text-center">
         <img src="/qr.jpg" height="200" width={200}  className="m-auto"alt="QR Code" />

            <p className="text-lg font-semibold">
              Total Amount:{" "}
              <span className="text-yellow-400">₹{total}</span>
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Please pay to this UPI <span className="text-yellow-400 font-semibold"></span>
              <br />
               Check that the name shows as <span className="font-bold text-white">Dattatreya N N</span> in your UPI app.
            </p>
         
          </div>
           <div className="space-y-2">
            <Label htmlFor="utr" className="text-yellow-400">Payment UTR Number</Label>
            <Input
              id="utr"
              placeholder="Enter UTR Number"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              className="bg-[#0b0f19] border-gray-700 focus:ring-yellow-400"
            />
          </div>

          {/* Submit Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition rounded-full py-3" >
                Submit Booking
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#101522] border border-gray-700 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
                <AlertDialogDescription>
                  You are booking for {kannadigas} Kannadigas and {nonKannadigas} Non-Kannadigas.
                  <br />
                  Total amount: <span className="text-yellow-400 font-semibold">₹{total}</span>
                  <br />
                  Make sure you have paid before submitting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-yellow-400 text-black hover:bg-yellow-500" onClick={pushOrder}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </main>
  <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent m-4"> Your Bookings</h2>
         {bookings.coupons.length === 0 ? (
        <p className="text-gray-500 text-center">No past bookings found.</p>
      ) : (
     <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">UTR</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
                 <th className="p-2 border">BookingStatus</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.coupons.map((b) => (
              <tr key={b.utr} className="text-center text-white m-4">
                <td className="p-2 border">{b.utr}</td>
                <td className="p-2 border">{b.name}</td>
                <td className="p-2 border">{b.email}</td>
                <td className="p-2 border">₹{b.total}</td>
                <td className="p-2 border">{b.status}</td>
                  <td className="p-2 border">{b.is_verified ? "Verified ✅" : "Pending "}</td>
                <td className="p-2 border">
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

    </div>
    </ProtectedRoute>
  );
}
