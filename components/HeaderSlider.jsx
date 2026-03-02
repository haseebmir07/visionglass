'use client'

import React, { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const HeaderSlider = () => {

  const sliderData = [
    {
      id: 1,
      type: "image",
      title:
        "Every product tells a story — a legacy of skilled hands and timeless tradition.",
      offer: "Vision Glass & Interiors",
      imgSrc: assets.akhtarmir,
    },
    {
      id: 2,
      type: "video",
      videoSrc: "/vision.mp4",
    },
    {
      id: 3,
      type: "image",
      title:
        "Art of Interior.",
      offer: "Vision Glass & Interiors",
      imgSrc: assets.owner2,
    },
    {
      id: 4,
      type: "image",
      title:
        "Choosing us means embracing Luxury, Quality, and Care.",
      offer: "Vision Glass & Interiors",
      imgSrc: assets.stuff,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const videoRef = useRef(null);

  /* ================= IMAGE AUTO SLIDE ONLY ================= */
  useEffect(() => {
    const currentItem = sliderData[currentSlide];

    // Only images auto-slide
    if (currentItem.type !== "image") return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  /* ================= VIDEO ENDED ================= */
  const handleVideoEnd = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  /* ================= SOUND TOGGLE ================= */
  const toggleSound = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  /* ================= MODAL ================= */
  const openModal = (videoSrc) => {
    setActiveVideo(videoSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveVideo(null);
  };

  return (
    <>
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[75vh] rounded-xl overflow-hidden">

        {sliderData.map((slide, index) => (

          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >

            {/* ================= IMAGE ================= */}
            {slide.type === "image" && (
              <Image
                src={slide.imgSrc}
                alt="banner"
                fill
                priority
                className="object-cover"
              />
            )}

            {/* ================= VIDEO ================= */}
            {slide.type === "video" && index === currentSlide && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onEnded={handleVideoEnd}
                  onClick={() => openModal(slide.videoSrc)}
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                >
                  <source src={slide.videoSrc} type="video/mp4" />
                </video>

                <button
                  onClick={toggleSound}
                  className="absolute top-5 right-5 z-20 bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-full"
                >
                  {isMuted ? "🔇 Sound Off" : "🔊 Sound On"}
                </button>
              </>
            )}

            {/* ================= OVERLAY ================= */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

            {/* ================= TEXT ================= */}
            {slide.type === "image" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
                <p className="text-orange-400 tracking-widest uppercase mb-4">
                  {slide.offer}
                </p>
                <h1 className="max-w-4xl text-3xl md:text-5xl font-semibold leading-tight">
                  {slide.title}
                </h1>
              </div>
            )}

          </div>
        ))}

        {/* ================= DOT NAV ================= */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {sliderData.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-8 rounded-full cursor-pointer ${
                currentSlide === index
                  ? "bg-orange-500"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>

      </div>

      {/* ================= FULLSCREEN MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <video
            autoPlay
            controls
            className="w-full h-full max-w-6xl max-h-[90vh] object-contain"
          >
            <source src={activeVideo} type="video/mp4" />
          </video>

        </div>
      )}
    </>
  );
};

export default HeaderSlider;
