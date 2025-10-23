"use client";
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetHomeBanner } from '@/src/utlis/useHomeBanner';

const slides = [
  {
    title: "Explore New Horizons",
    description: "Discover breathtaking places and incredible adventures.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Urban Lifestyle",
    description: "Feel the vibe of vibrant cities across the globe.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Nature & Relaxation",
    description: "Find your peace in nature's embrace.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
  },
];

const Carousel = () => {
  const { homebanner, loading, error, refetch } = useGetHomeBanner();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  const slides = homebanner || [];
  console.log('slide', slides)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto play functionality
  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);


  if (loading)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-gray-500">Loading banners...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-red-500">Failed to load banners</p>
      </div>
    );

  if (!slides.length)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-gray-500">No banners found</p>
      </div>
    );


  return (
    <div className="relative w-[98%]   mx-auto mt-6 group">
      {/* Main carousel container */}
      <div
        className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
                }`}
            >
              <img
                src={slide.images}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end items-center text-white text-center p-6 md:p-8 lg:p-12">
                <div className="max-w-4xl mx-auto transform translate-y-0 opacity-100 transition-all duration-700">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-sm md:text-lg lg:text-xl opacity-90 leading-relaxed">
                    {slide.description}
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
        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {slides.map((_, index) => (
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
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative overflow-hidden rounded-lg transition-all duration-300 ${index === currentSlide
              ? 'ring-2 ring-blue-500 ring-offset-2'
              : 'opacity-60 hover:opacity-80'
              }`}
          >
            <img
              src={slide.images}
              alt={slide.title}
              className="w-16 h-10 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;