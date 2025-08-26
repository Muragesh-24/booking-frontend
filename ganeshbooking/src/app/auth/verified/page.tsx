// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function VerifiedPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const token = searchParams.get("query");
//     if (token) {
//       localStorage.setItem("authToken", token);
//     }
//   }, [searchParams]);

//   return (
//     <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center px-6">
//       {/* Top Bar with Home Button */}
//       <div className="absolute top-4 left-4">
//         <button
//           onClick={() => router.push("/")}
//           className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:scale-105 transition"
//         >
//           Home
//         </button>
//       </div>

//       {/* Center Content */}
//       <div className="text-center">
//         <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
//           Verification Successful 🎉
//         </h1>
//         <button
//           onClick={() => router.push("/booking")}
//           className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:scale-105 transition"
//         >
//           Go to Booking
//         </button>
//       </div>
//     </div>
//   );
// }


import { Suspense } from "react";
import VerifiedPage from "./verifiedpage";


export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-10">
  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
</div>
}>
      <VerifiedPage/>
    </Suspense>
  );
}
