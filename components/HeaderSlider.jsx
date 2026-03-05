'use client'

import React, { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const HeaderSlider = () => {

  const sliderData = [
    {
      id: 1,
      type: "image",
      // title: "Every product tells a story — a legacy of skilled hands and timeless tradition.",
      // offer: "Vision Glass & Interiors",
      imgSrc: assets.akhtarmir,
    },
    {
      id: 2,
      type: "video",
      videoSrc: "/Vision_Glass_Interior_Promotional_Video.mp4",
    },
    {
      id: 3,
      type: "video",
      videoSrc: "/vision2.mp4",
    },
    {
      id: 4,
      type: "image",
      title: "Art of Interior.",
      offer: "Vision Glass & Interiors",
      imgSrc: assets.owner2,
    },
    {
      id: 5,
      type: "image",
      title: "Choosing us means embracing Luxury, Quality, and Care.",
      offer: "Vision Glass & Interiors",
      imgSrc: assets.slider4,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const videoRef = useRef(null);
  const touchStartX = useRef(0);

  /* IMAGE AUTO SLIDE */

  useEffect(() => {

    const currentItem = sliderData[currentSlide];

    if (currentItem.type !== "image") return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4500);

    return () => clearTimeout(timer);

  }, [currentSlide]);

  /* VIDEO END */

  const handleVideoEnd = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  /* SOUND */

  const toggleSound = () => {

    if (!videoRef.current) return;

    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;

    setIsMuted(newMuted);
  };

  /* MODAL */

  const openModal = (videoSrc) => {
    setActiveVideo(videoSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveVideo(null);
  };

  /* ARROWS */

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? sliderData.length - 1 : prev - 1
    );
  };

  /* MOBILE SWIPE */

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {

    const touchEndX = e.changedTouches[0].screenX;

    if (touchStartX.current - touchEndX > 50) {
      nextSlide();
    }

    if (touchEndX - touchStartX.current > 50) {
      prevSlide();
    }
  };

  return (
    <>
      {/* HERO SLIDER */}

      <div
        className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[85vh] rounded-xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {sliderData.map((slide, index) => (

          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >

            {/* IMAGE */}

            {slide.type === "image" && (

              <div className="absolute inset-0 overflow-hidden">

                <Image
                  src={slide.imgSrc}
                  alt="banner"
                  fill
                  priority
                  className={`object-cover object-center transition-transform duration-[8000ms] ease-linear ${
                    index === currentSlide ? "scale-110" : "scale-100"
                  }`}
                />

              </div>

            )}

            {/* VIDEO */}

            {slide.type === "video" && index === currentSlide && (

              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onEnded={handleVideoEnd}
                  onClick={() => openModal(slide.videoSrc)}
                  className="absolute inset-0 w-full h-full object-cover object-center cursor-pointer"
                >
                  <source src={slide.videoSrc} type="video/mp4" />
                </video>

                <button
                  onClick={toggleSound}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-black/40 backdrop-blur-md text-white px-3 py-2 rounded-full"
                >
                  {isMuted ? "🔇 Sound Off" : "🔊 Sound On"}
                </button>

              </>

            )}

            {/* OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

            {/* TEXT */}

            {slide.type === "image" && (

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">

                <p className="text-orange-400 tracking-widest uppercase mb-3 text-sm sm:text-base">
                  {slide.offer}
                </p>

                <h1 className="max-w-4xl text-xl sm:text-3xl md:text-5xl font-semibold leading-tight">
                  {slide.title}
                </h1>

              </div>

            )}

          </div>

        ))}

        {/* ARROWS */}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white w-10 h-10 rounded-full"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white w-10 h-10 rounded-full"
        >
          ›
        </button>

        {/* DOTS */}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">

          {sliderData.map((_, index) => (

            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-6 rounded-full cursor-pointer ${
                currentSlide === index ? "bg-orange-500" : "bg-white/40"
              }`}
            />

          ))}

        </div>

      </div>

      {/* VIDEO MODAL */}

      {isModalOpen && (

        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">

          <button
            onClick={closeModal}
            className="absolute top-6 right-8 text-white text-4xl"
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