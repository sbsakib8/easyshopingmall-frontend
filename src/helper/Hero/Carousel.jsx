"use client";

import Skeleton from "@/src/compronent/loading/Skeleton";
import Container from "@/src/compronent/shared/Container";
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

  // Auto play functionality
  React.useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const interval = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (slides?.length === 0) {
    return (
      <Section className="py-4 md:py-8 bg-gradient-to-b from-primary/5 from-20% to-100% to-primary/30">
        <div className="relative h-[200px] sm:h-[400px] lg:h-[600px] w-full px-2 sm:px-4 md:px-8 lg:px-12 2xl:px-16">
          <Skeleton className="w-full h-full rounded-md animate-pulse" />
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-4 md:py-8 bg-gradient-to-b from-primary/5 from-20% to-100% to-primary/30">
      <div className="px-2 sm:px-4 md:px-8 lg:px-12 2xl:px-16">
        <div className=" relative h-[200px] sm:h-[400px] lg:h-[600px] w-full">
          {/* Main carousel container */}
          <div
            className="relative w-full h-full rounded-md overflow-hidden shadow-2xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Slides */}
            <div className="relative w-full h-full ">
              {slides?.map((slide, index) => (
                <div
                  key={slide._id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : index < currentSlide
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                    }`}
                >
                  <Image
                    src={(Array.isArray(slide?.images) ? slide?.images[0] : (slide?.images || slide?.image)) || "/img/product.jpg"}
                    alt={slide?.title || "Banner"}
                    width={1200}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10
                     bg-white/20 hover:bg-white/30 backdrop-blur-sm
                     text-accent-content p-2 md:p-3 rounded-full
                     transition-all duration-300 ease-in-out
                     opacity-0 group-hover:opacity-100
                     hover:scale-110 active:scale-95
                     border border-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10
                     bg-white/20 hover:bg-white/30 backdrop-blur-sm
                     text-accent-content p-2 md:p-3 rounded-full
                     transition-all duration-300 ease-in-out
                     opacity-0 group-hover:opacity-100
                     hover:scale-110 active:scale-95
                     border border-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Progress indicator */}
            <div className="hidden md:block absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-accent-content text-sm">
              {currentSlide + 1} / {slides?.length}
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="hidden lg:flex justify-center mt-1 md:mt-6 space-x-2">
          {slides?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? "bg-blue-600 w-8"
                : "bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail navigation (optional) */}
        <div className="hidden lg:flex justify-center mt-4 space-x-2">
          {slides?.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden rounded-lg transition-all duration-300 ${index === currentSlide
                ? "ring-2 ring-blue-500 ring-offset-2"
                : "opacity-60 hover:opacity-80"
                }`}
            >
              <Image
                src={(Array.isArray(slide?.images) ? slide?.images[0] : (slide?.images || slide?.image)) || "/img/product.jpg"}
                alt={slide?.title || "Thumbnail"}
                width={1200}
                height={600}
                className="w-16 h-10 object-cover"
              />
            </button >
          ))}
        </div >
      </div>
    </Section >
  );
};

export default Carousel;
