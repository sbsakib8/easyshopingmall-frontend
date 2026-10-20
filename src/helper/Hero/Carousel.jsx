"use client";

import Skeleton from "@/src/compronent/loading/Skeleton";
import Section from "@/src/compronent/shared/Section";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Carousel = ({ initialData }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  // Filter only active banners from API
  const slides = React.useMemo(() => {
    const data = initialData || [];
    if (!Array.isArray(data)) return [];
    return data.filter((banner) => banner.active === true);
  }, [initialData]);

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto play functionality — reset on slide change so timer always counts from 0
  React.useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const interval = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, currentSlide]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (slides?.length === 0) {
    return (
      <Section className="py-2 md:py-4 bg-bg">
        <div className="h-[200px] sm:h-[350px] md:h-[420px] lg:h-[480px] xl:h-[540px] w-full px-2 sm:px-4 md:px-8">
          <Skeleton className="w-full h-full rounded-2xl animate-pulse" />
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-2 md:py-4 bg-bg">
      <div className="px-2 sm:px-4 md:px-8">
        <div className="relative h-[200px] sm:h-[350px] md:h-[420px] lg:h-[480px] xl:h-[540px] w-full">
          {/* Main carousel container — `group` enables group-hover for arrows */}
          <div
            className="group relative w-full h-full rounded-md overflow-hidden shadow-2xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Slides */}
            <div className="relative w-full h-full">
              {slides?.map((slide, index) => (
                <div
                  key={slide._id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0 z-10"
                      : index < currentSlide
                        ? "opacity-0 -translate-x-full z-0"
                        : "opacity-0 translate-x-full z-0"
                  }`}
                >
                  <Image
                    src={
                      (Array.isArray(slide?.images)
                        ? slide?.images[0]
                        : slide?.images || slide?.image) || "/img/product.jpg"
                    }
                    alt={slide?.title || "Banner"}
                    width={1200}
                    height={600}
                    className="w-full h-full object-fill"
                    priority={index === 0}
                  />
                  {/* Subtle gradient overlay for arrow readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Navigation arrows — visible on group-hover */}
            <button
              onClick={prevSlide}
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20
                     bg-black/30 hover:bg-black/60 backdrop-blur-sm
                     text-white p-2 md:p-3 rounded-full
                     transition-all duration-300 ease-in-out
                     opacity-0 group-hover:opacity-100
                     hover:scale-110 active:scale-95
                     border border-white/30 shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20
                     bg-black/30 hover:bg-black/60 backdrop-blur-sm
                     text-white p-2 md:p-3 rounded-full
                     transition-all duration-300 ease-in-out
                     opacity-0 group-hover:opacity-100
                     hover:scale-110 active:scale-95
                     border border-white/30 shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Slide counter badge */}
            <div className="hidden md:flex absolute top-4 right-4 z-20 items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
              <span className="text-white/90">{currentSlide + 1}</span>
              <span className="text-white/50">/</span>
              <span className="text-white/70">{slides?.length}</span>
            </div>

            {/* Auto-play animated progress bar */}
            {isAutoPlaying && slides.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/20">
                <div
                  key={currentSlide}
                  className="h-full bg-primary/90 rounded-full"
                  style={{ animation: "bannerProgress 4s linear forwards" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dots indicator — always visible */}
        <div className="flex justify-center mt-3 gap-2">
          {slides?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "bg-primary w-7 h-2.5"
                  : "bg-line hover:bg-muted w-2.5 h-2.5"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail navigation */}
        <div className="hidden lg:flex justify-center mt-3 gap-2">
          {slides?.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "ring-2 ring-primary ring-offset-2 scale-105"
                  : "opacity-55 hover:opacity-80 hover:scale-105"
              }`}
            >
              <Image
                src={
                  (Array.isArray(slide?.images)
                    ? slide?.images[0]
                    : slide?.images || slide?.image) || "/img/product.jpg"
                }
                alt={slide?.title || "Thumbnail"}
                width={1200}
                height={600}
                className="w-16 h-10 object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Keyframes for progress bar */}
      <style>{`
        @keyframes bannerProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </Section>
  );
};

export default Carousel;
