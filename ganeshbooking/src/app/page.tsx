"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Menu, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const events = [
    { time: "08:00 AM", title: "Ganesh Pratishthana Pooja" },
    { time: "06:00 PM", title: "Evening Cultural Activities" },
    { time: "08:00 PM", title: "Dinner" },
    { time: "10:00 PM", title: "Ganesh Visarjana" },
  ];

  const openbook=()=>{
    setIsOpen(false) 
          
          router.push("/booking")
  }
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white relative overflow-hidden scroll-smooth">
      {/* Stars background */}
      <div className="absolute inset-0 bg-[radial-gradient(white,transparent_1.5px)] [background-size:20px_20px] opacity-20"></div>

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-6 md:px-16 py-4 absolute top-0 z-50">
        {/* Logo */}
        <div className="text-white font-bold text-lg md:text-xl">
          Nammoora Ganeshotsava
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-8 text-gray-300 font-medium">
          <li className="hover:text-yellow-400 cursor-pointer">Home</li>
  
          <li className="hover:text-yellow-400 cursor-pointer" onClick={()=>{
            router.push("/booking")
          }}>Book your spot</li>
        </ul>

        {/* Desktop Sign-in */}
        <button className="hidden md:block border border-yellow-400 text-yellow-400 px-4 py-1 rounded-full hover:bg-yellow-400 hover:text-black transition" onClick={()=>{router.push("/auth")}}>
          Sign In
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-[#0b0f19]/95 flex flex-col items-center justify-center gap-8 text-xl font-semibold transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-40`}
      >
        <a href="#" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>
          Home
        </a>
      
        <a href="#" className="hover:text-yellow-400" onClick={() => openbook()
        }>
          Book your spot
        </a>
        <button className="border border-yellow-400 text-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition" onClick={()=>{router.push("/auth")}}>
          Sign In
        </button>
      </div>

      {/* Hero section */}
      <section className="flex flex-col items-center text-center px-4 md:px-8 mt-32 md:mt-28 relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            ಶ್ರೀ ಗಣೇಶ ಚತುರ್ಥಿ ಮಹೋತ್ಸವ - ಕನ್ನಡ ಬಳಗ
          </span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
          Celebrating Ganeshotsav By Kannada Balaga IIT Kanpur. A rebirth of culture, energy, and art.
        </p>
        <button
          
          className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition"
         onClick={()=>{
          router.push("./booking")
         }}>
         Book your spot
        </button>
      </section>

      {/* Events Timeline Section */}
      <section id="events" className="relative z-10 py-20 px-6 md:px-20">
    <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
  Events Timeline
</h2>

<div className="text-center text-gray-700 mb-12 space-y-1">
  <p className="font-semibold">Date: <span className="text-yellow-500">6th September</span></p>
  <p className="font-semibold">Venue: <span className="text-yellow-500">Aashiyana Hall, New Shopping Complex</span></p>
</div>

        <div className="relative border-l-4 border-yellow-400 max-w-2xl mx-auto">
          {events.map((event, idx) => (
            <div key={idx} className="mb-10 ml-6">
              <div className="absolute w-4 h-4 bg-yellow-400 rounded-full -left-2 mt-1"></div>
              <time className="mb-1 text-sm font-normal text-gray-400">
                {event.time}
              </time>
              <h3 className="text-lg font-semibold">{event.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Menu Section */}
    {/* Dinner Menu Section */}
<section className="relative z-10 py-20 px-6 md:px-20 text-center ">
  <h3 className="text-4xl font-extrabold mb-12 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
    🍽️ Dinner Menu
  </h3>

  <div className="flex justify-center">
    <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full">
      <ul className="space-y-4 text-gray-700 text-lg font-medium">
 <li className="hover:scale-105 transition-transform">Kosambari</li>
<li className="hover:scale-105 transition-transform">Happla (sun-dried papad) </li>   
<li className="hover:scale-105 transition-transform">Bajji</li>
<li className="hover:scale-105 transition-transform">Godi Huggi (sweet wheat porridge)</li> 
<li className="hover:scale-105 transition-transform">Puliyogare</li>
<li className="hover:scale-105 transition-transform">Chapati</li>
<li className="hover:scale-105 transition-transform">Kalu Palya (lentil/curry dish) </li>  
<li className="hover:scale-105 transition-transform">Chutney Pudi (spiced dry chutney powder)</li>
<li className="hover:scale-105 transition-transform">Rice & Sambar</li>
<li className="hover:scale-105 transition-transform">Majjige (buttermilk)</li>

      </ul>
    </div>
  </div>
</section>



      {/* Footer */}
      <footer className="relative z-10 bg-[#0b0f19] border-t border-gray-700 py-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Nammoora Ganeshotsava. All rights reserved.</p>
        <p className="mt-2">
          Made with ❤️ for tradition & culture.
        </p>
      </footer>
    </main>
  );
}
