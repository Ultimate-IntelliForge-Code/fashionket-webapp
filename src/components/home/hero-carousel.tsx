import { useState, useEffect, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeroType = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  textColor: string;
  bgColor: string;
  cta: string;
  image: string;
};

interface HeroProps {
  heroSlides: HeroType[];
  autoSlideInterval?: number; // Allow custom interval
}

// Fashionista-themed default slides with high-quality fashion images
const defaultFashionSlides: HeroType[] = [
  {
    id: "1",
    title: "Summer Collection 2024",
    subtitle: "Embrace Your Style",
    description: "Discover the latest trends in summer fashion. From casual wear to evening gowns, find your perfect look.",
    textColor: "text-white",
    bgColor: "from-black/60 to-transparent",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&h=900&fit=crop", // Fashion model
  },
  {
    id: "2",
    title: "Elegant Evening Wear",
    subtitle: "Make Every Moment Memorable",
    description: "Experience luxury with our premium evening collection. Perfect for special occasions and gala events.",
    textColor: "text-white",
    bgColor: "from-black/70 to-transparent",
    cta: "Explore Collection",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=900&fit=crop", // Fashion outfit
  },
  {
    id: "3",
    title: "Casual Comfort",
    subtitle: "Everyday Essentials",
    description: "Stay comfortable and stylish with our everyday wear collection. Quality meets affordability.",
    textColor: "text-white",
    bgColor: "from-black/50 to-transparent",
    cta: "Shop Collection",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop", // Shopping fashion
  },
  {
    id: "4",
    title: "Accessories Galore",
    subtitle: "Complete Your Look",
    description: "From statement jewelry to designer bags, find the perfect accessories to elevate any outfit.",
    textColor: "text-white",
    bgColor: "from-black/60 to-transparent",
    cta: "Shop Accessories",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=900&fit=crop", // Fashion accessories
  },
];

const HeroCarousel = ({ heroSlides = defaultFashionSlides, autoSlideInterval = 3000 }: HeroProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isHoveringRef = useRef(false);

  // Setup carousel API and event listeners
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    api.on("settle", () => {
      // Reset auto-play timer when manually navigating
      if (!isHoveringRef.current && isAutoPlaying) {
        resetAutoPlay();
      }
    });
  }, [api, isAutoPlaying]);

  // Auto-slide functionality
  const startAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    autoPlayTimerRef.current = setInterval(() => {
      if (!isHoveringRef.current && api && isAutoPlaying) {
        const nextSlide = (current + 1) % count;
        api.scrollTo(nextSlide);
      }
    }, autoSlideInterval);
  }, [api, current, count, isAutoPlaying, autoSlideInterval]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = undefined;
    }
  }, []);

  const resetAutoPlay = useCallback(() => {
    stopAutoPlay();
    startAutoPlay();
  }, [stopAutoPlay, startAutoPlay]);

  // Handle auto-play lifecycle
  useEffect(() => {
    if (api && count > 0 && isAutoPlaying) {
      startAutoPlay();
    }

    return () => {
      stopAutoPlay();
    };
  }, [api, count, isAutoPlaying, startAutoPlay, stopAutoPlay]);

  // Handle hover pause
  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    if (isAutoPlaying) {
      stopAutoPlay();
    }
  }, [isAutoPlaying, stopAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    if (isAutoPlaying && api) {
      startAutoPlay();
    }
  }, [isAutoPlaying, api, startAutoPlay]);

  // Manual navigation with auto-play reset
  const goToSlide = useCallback((index: number) => {
    if (api) {
      api.scrollTo(index);
      if (!isHoveringRef.current && isAutoPlaying) {
        resetAutoPlay();
      }
    }
  }, [api, isAutoPlaying, resetAutoPlay]);

  // Toggle auto-play
  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => {
      const newState = !prev;
      if (newState && api && !isHoveringRef.current) {
        startAutoPlay();
      } else {
        stopAutoPlay();
      }
      return newState;
    });
  }, [api, startAutoPlay, stopAutoPlay]);

  // Preload images for better performance
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [heroSlides]);

  return (
    <section 
      className="relative overflow-hidden bg-brand-dark"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-20 hidden md:block">
        <button
          onClick={toggleAutoPlay}
          className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-black/70 transition-colors"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <Carousel 
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          duration: 40,
          align: "center",
        }}
      >
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[280px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                {/* Background Image with Optimization */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-700 group-hover:scale-105"
                    loading={slide.id === heroSlides[0]?.id ? "eager" : "lazy"}
                    fetchPriority={slide.id === heroSlides[0]?.id ? "high" : "low"}
                  />
                  {/* Gradient Overlay for better text readability */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r",
                      slide.bgColor || "from-black/50 to-transparent"
                    )}
                  />
                  
                  {/* Additional overlay for better text contrast on mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent sm:hidden" />
                </div>

                {/* Content Container */}
                <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                  <div className="max-w-2xl w-full sm:w-auto">
                    {/* Animated Badge */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <Badge className="mb-3 sm:mb-4 bg-white/20 text-white backdrop-blur-sm border-0 shadow-lg inline-flex">
                        <Sparkles className="h-3 w-3 mr-1.5 animate-pulse" />
                        <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                          NEW COLLECTION
                        </span>
                      </Badge>
                    </div>

                    {/* Title with staggered animation */}
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
                      <h1
                        className={cn(
                          "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight",
                          slide.textColor || "text-white"
                        )}
                      >
                        {slide.title}
                      </h1>
                    </div>

                    {/* Subtitle */}
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200">
                      <h2
                        className={cn(
                          "text-base sm:text-lg md:text-xl font-semibold mb-2",
                          slide.textColor || "text-white/90"
                        )}
                      >
                        {slide.subtitle}
                      </h2>
                    </div>

                    {/* Description - Hidden on mobile, shown on tablet up */}
                    <div className="animate-in fade-in duration-500 delay-300 hidden sm:block">
                      <p
                        className={cn(
                          "text-sm md:text-base mb-6 md:mb-8 max-w-lg",
                          slide.textColor || "text-white/80"
                        )}
                      >
                        {slide.description}
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="animate-in fade-in slide-in-from-bottom-7 duration-500 delay-400 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button
                        size="lg"
                        className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold group"
                      >
                        {slide.cta}
                        <ShoppingBag className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className={cn(
                          "border-2 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold group",
                          slide.textColor === "text-white" 
                            ? "border-white text-white hover:bg-white/10" 
                            : "border-brand-dark text-brand-dark hover:bg-brand-dark/10"
                        )}
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows - Enhanced for better UX */}
        <CarouselPrevious className="hidden md:flex left-4 lg:left-8 bg-white/90 hover:bg-white border-0 shadow-lg h-10 w-10 lg:h-12 lg:w-12 transition-all duration-200 hover:scale-110" />
        <CarouselNext className="hidden md:flex right-4 lg:right-8 bg-white/90 hover:bg-white border-0 shadow-lg h-10 w-10 lg:h-12 lg:w-12 transition-all duration-200 hover:scale-110" />
      </Carousel>

      {/* Dot Indicators - Enhanced with progress bar animation */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2 sm:gap-3 items-center">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={cn(
                  "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300",
                  current === index
                    ? "bg-brand-primary w-6 sm:w-8" // Active dot is wider
                    : "bg-white/50 hover:bg-white/80"
                )}
              />
              {/* Progress animation for active dot when auto-playing */}
              {current === index && isAutoPlaying && (
                <div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-brand-accent rounded-full"
                  style={{
                    width: "100%",
                    animation: `progress ${autoSlideInterval}ms linear infinite`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Add keyframes for progress animation */}
      <style>{`
        @keyframes progress {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;