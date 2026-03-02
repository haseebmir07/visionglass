'use client'

import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

/* ================= TEAM ================= */
const team = [
  {
    id: 1,
    image: assets.abrar,
    title: "Founder - Syed Abrar",
    description: "The Vision Behind the Future.",
  },
  {
    id: 2,
    image: assets.uncle,
    title: "Co-Founder & Master Craftsman - Syed Isaq",
    description: "The Hands Behind the Legacy.",
  },
  {
    id: 3,
    image: assets.umar,
    title: "Co-Founder - Syed Umrez",
    description: "The Vision Behind the Future.",
  },
];

/* ================= ULTRA PREMIUM STATS ================= */
const stats = [
  { number: 15, suffix: "+", label: "Years of Experience" },
  { number: 1350, suffix: "+", label: "Completed Projects" },
  { number: 820, suffix: "+", label: "Happy Clients" },
  { number: 25, suffix: "+", label: "Ongoing Projects" },
];

/* ================= PROJECT SLIDER ================= */
const projects = [
  {
    image: assets.owner2,
    title: "Luxury Glass Partition",
    description: "Premium frameless office partition installation.",
  },
  {
    image: assets.showercubicles,
    title: "Modern Shower Cubicle",
    description: "Elegant glass cubicle with matte black fittings.",
  },
  {
    image: assets.project3,
    title: "LED Mirror Installation",
    description: "Custom backlit LED mirror for luxury interiors.",
  },
  {
    image: assets.owner2,
    title: "LED Mirror Installation",
    description: "Custom backlit LED mirror for luxury interiors.",
  },
  {
    image: assets.akhtarmir,
    title: "LED Mirror Installation",
    description: "Custom backlit LED mirror for luxury interiors.",
  },
];

const FeaturedProduct = () => {

  /* ================= SLIDER ================= */
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ================= ULTRA STATS ANIMATION ================= */
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = document.getElementById("stats-section");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    stats.forEach((stat, index) => {
      let start = 0;
      const duration = 2000;
      const increment = stat.number / (duration / 16);

      setTimeout(() => {
        const counter = setInterval(() => {
          start += increment;

          if (start >= stat.number) {
            start = stat.number;
            clearInterval(counter);
          }

          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[index] = Math.floor(start);
            return newCounts;
          });
        }, 16);
      }, index * 300);
    });
  }, [visible]);

  return (
    <div className="mt-14">

      {/* ================= OUR TEAM ================= */}
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Our Experience</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

     


      {/* ================= LUXURY BANNER ================= */}
      <div className="relative h-[60vh] mt-2 flex items-center justify-center text-white overflow-hidden">
        <Image
          src={assets.owner2}
          alt="Glass Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative text-center px-6 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-wide">
            Crafting Glass Excellence
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Transforming Spaces with Precision, Luxury & Innovation
          </p>
        </div>
      </div>


      {/* ================= ULTRA PREMIUM STATS ================= */}
      <div
        id="stats-section"
        className="py-28 bg-black text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 px-6 relative z-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 text-center transform transition duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-4xl md:text-5xl font-extrabold text-orange-500 drop-shadow-lg animate-pulse">
                {counts[index].toLocaleString()}
                {item.suffix}
              </h3>
              <p className="mt-4 text-gray-300 tracking-wide">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>


      {/* ================= PROJECT SLIDER ================= */}
      <div className="bg-gray-50 py-24 px-5">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800">
              Our Completed Projects
            </h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="relative w-full h-[75vh] overflow-hidden rounded-3xl shadow-2xl">
            <div
              className="flex h-full transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {projects.map((project, index) => (
                <div key={index} className="relative w-full h-full flex-shrink-0">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50"></div>

                  <div className="absolute bottom-12 left-12 text-white max-w-xl">
                    <h3 className="text-3xl md:text-5xl font-bold">
                      {project.title}
                    </h3>
                    <p className="mt-4 text-lg text-gray-300">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 right-8 flex gap-3">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full transition ${
                    index === current
                      ? "bg-orange-600 scale-110"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>


      {/* ================= CALL TO ACTION ================= */}
      <div className="bg-black text-white py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to Elevate Your Space?
        </h2>
        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Let's bring your vision to life with precision-crafted glass solutions.
        </p>
       <a
  href="https://wa.me/918880605191?text=Hello%20Vision%20Glass%20%26%20Interiors,%20I%20would%20like%20to%20enquire%20about%20your%20services."
  target="_blank"
  rel="noopener noreferrer"
  className="mt-8 inline-block bg-orange-600 hover:bg-orange-700 px-8 py-4 rounded-full text-lg transition duration-300 text-white"
>
  Contact Us
</a>
      </div>

    </div>
  );
};

export default FeaturedProduct;