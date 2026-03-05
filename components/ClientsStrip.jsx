"use client";
import React from "react";


const clients = [
    { name: "", logo: "/clients/brikoven.png" },
    { name: "", logo: "/clients/abd.png" },
    { name: "", logo: "/clients/bpl.png" },
    { name: "", logo: "/clients/ro.png" },
    { name: "UB-City", logo: "/clients/ub.png" },
    { name: "", logo: "/clients/sl.png" },
    { name: "Manyavar", logo: "/clients/manyavar.png" },
    { name: "JW MARRIOTT", logo: "/clients/jw.png" },
     { name: "The Leela", logo: "/clients/leela.png" },
     { name: "", logo: "/clients/theritz.png" },
     { name: "", logo: "/clients/forum.png" },
     { name: "", logo: "/clients/fortis.png" },
     { name: "Mantri Square", logo: "/clients/ms.png" },
     { name: "Shoba", logo: "/clients/shoba.png" },
     { name: "", logo: "/clients/rm.png" },
     { name: "Prestige Group", logo: "/clients/pres.png" },
     { name: "ADARSH PALM", logo: "/clients/ADARSH PALM.png" },
     { name: "", logo: "/clients/malabar.png" },
     { name: "", logo: "/clients/bhima.png" },
     { name: "", logo: "/clients/anand.jpeg" },
     { name: "", logo: "/clients/ASPIRE INDUSTRIAL.jpg.jpeg" },
     { name: "BRIGADE", logo: "/clients/BRIGADE.jpg.jpeg" },
     { name: "", logo: "/clients/dd.jpeg" },
     { name: "Indus Valley", logo: "/clients/indus-valley.png" },
     { name: "Valley", logo: "/clients/VALLEY.jpg.jpeg" },
     { name: "VED ACADEMY", logo: "/clients/VED ACADEMY.png" },

];

const ClientsStrip = () => {
    return (
        <div className="w-full my-8">
            {/* Section label */}
            <p className="text-center text-sm font-bold uppercase tracking-[0.25em] text-gray-900 mb-5">
                Our Esteemed Clients
            </p>

            {/* Scrolling strip */}
            <div className="relative overflow-hidden bg-white border-y border-gray-200 py-6">
                {/* Left fade */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
                {/* Right fade */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

                {/* Track — duplicated to create infinite loop */}
                <div
                    className="flex w-max"
                    style={{ animation: "clients-scroll 30s linear infinite" }}
                    onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
                    onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
                >
                    {[...clients, ...clients].map((client, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 mx-12 select-none cursor-default"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={client.logo}
                                alt={client.name}
                                className="h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition duration-300"
                                onError={e => { e.currentTarget.style.display = "none"; }}
                            />
                            <span className="text-base font-semibold text-gray-600 whitespace-nowrap hover:text-gray-900 transition-colors duration-200">
                                {client.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Keyframe — scoped inline to avoid Tailwind config changes */}
            <style>{`
        @keyframes clients-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
};

export default ClientsStrip;
