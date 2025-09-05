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
   const [phone, setPhone] = useState("");
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
  nonKannadigaTotal = nonKannadigas * priceNonKannadiga * 0.9;
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
            phone,
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
 setEmail("")
 setName("")
 setPhone("")
 setUtr("")
 setKannadigas(0)
 setNonKannadigas(0)
   
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
    
  <div className="bg-black min-h-screen flex items-center justify-center">
    <div className="text-white text-center p-8">
     <h1 className="text-4xl font-bold mb-4">Booking Closed</h1>
     <p className="text-xl">We are currently not accepting any new bookings.</p>
     <p className="mt-2">Please check back later.</p>
    </div>
  </div>
  );
}
