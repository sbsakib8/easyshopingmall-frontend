"use client";
import { useGetHomeBanner } from '@/src/utlis/useHomeBanner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import Skeleton from '../../compronent/loading/Skeleton';

const Carousel = ({ initialData }) => {
  const { homebanner: apiBanners, loading: apiLoading, error, refetch } = useGetHomeBanner();
  const [homebanner, setHomeBanner] = React.useState(initialData || null);
  const [loading, setLoading] = React.useState(!initialData);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  React.useEffect(() => {
    if (apiBanners) {
      setHomeBanner(apiBanners);
      setLoading(false);
    }
  }, [apiBanners]);

  React.useEffect(() => {
    if (apiLoading && !initialData) {
      setLoading(true);
    }
  }, [apiLoading, initialData]);

  // Filter only active banners from API
  const slides = React.useMemo(() => {
    if (!homebanner || !Array.isArray(homebanner)) return [];
    return homebanner.filter(banner => banner.active === true);
  }, [homebanner]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides?.length) % slides?.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto play functionality
  React.useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const interval = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);


  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);


  if (loading)
    return (
      <div className="relative h-[200px] sm:h-[400px] lg:h-[600px] w-[98%] mx-auto">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-red-500">Failed to load banners</p>
      </div>
    );

  if (!slides?.length)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-gray-500">No banners found</p>
      </div>
    );


  return (
    <div className="relative h-[200px] sm:h-[400px] lg:h-[600px] w-[98%] mx-auto  ">
      {/* Main carousel container */}
      <div
        className="relative w-full h-full rounded-sm lg:rounded-2xl overflow-hidden shadow-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slides */}
        <div className="relative w-full h-full ">
          {slides?.map((slide, index) => (
            <div
              key={slide._id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
                }`}
            >
              <Image
                src={slide?.images?.[0] || ""}
                alt={slide?.title || "Banner"}
                fill
                priority={index === 0}
                className="object-cover"
              />


              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end items-center text-white text-center  md:p-8 lg:p-12">
                <div className="max-w-4xl mx-auto transform translate-y-0 opacity-100 transition-all duration-700">
                  <h2 className="hidden md:block text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight text-white px-4 py-2 rounded-lg md:px-0 md:py-0 md:rounded-none">
                    {slide?.title}
                  </h2>
                  <p className="hidden md:block text-sm md:text-lg lg:text-xl opacity-90 leading-relaxed">
                    {slide?.Description || slide?.description || ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 
                     bg-white/20 hover:bg-white/30 backdrop-blur-sm 
                     text-white p-2 md:p-3 rounded-full 
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
                     text-white p-2 md:p-3 rounded-full 
                     transition-all duration-300 ease-in-out
                     opacity-0 group-hover:opacity-100
                     hover:scale-110 active:scale-95
                     border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Progress indicator */}
        <div className="hidden md:block absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
          {currentSlide + 1} / {slides?.length}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="hidden lg:flex justify-center mt-1 md:mt-6 space-x-2">
        {slides?.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? 'bg-blue-600 w-8'
              : 'bg-gray-300 hover:bg-gray-400'
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
              ? 'ring-2 ring-blue-500 ring-offset-2'
              : 'opacity-60 hover:opacity-80'
              }`}
          >
            <Image
              src={slide?.images?.[0] || slide?.image || ""}
              alt={slide?.title || "Thumbnail"}
              width={64}
              height={40}
              className="object-cover h-10 w-16"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;