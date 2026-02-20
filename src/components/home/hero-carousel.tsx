import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Sparkles } from "lucide-react"

export type HeroType = {
  id: string,
  title: string,
  subtitle: string,
  description: string,
  textColor: string, 
  bgColor: string,
  cta: string,
  image: string
}
interface HeroProps {
  heroSlides: HeroType[]
}

const HeroCarousel = ({heroSlides}: HeroProps) => {
  return (
    <section className="relative overflow-hidden">
      <Carousel className="w-full">
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[450px] overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading="eager" // Prioritize loading for hero image
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} mix-blend-multiply`}
                  />
                </div>

                {/* Content - Centered with proper padding for mobile */}
                <div className="relative h-full container mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-center sm:justify-start">
                  <div className="max-w-2xl w-full sm:w-auto text-center sm:text-left">
                    {/* Badge - Hidden on very small screens or adjust size */}
                    <Badge className="mb-3 sm:mb-4 bg-white/20 text-white backdrop-blur-sm border-0 inline-flex mx-auto sm:mx-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      <span className="text-[10px] sm:text-xs">New Collection</span>
                    </Badge>

                    {/* Title - Responsive sizing */}
                    <h1
                      className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 ${slide.textColor} leading-tight`}
                    >
                      {slide.title}
                    </h1>

                    {/* Subtitle - Responsive */}
                    <h2
                      className={`text-sm sm:text-base md:text-lg font-semibold mb-2 ${slide.textColor}`}
                    >
                      {slide.subtitle}
                    </h2>

                    {/* Description - Hide on smallest screens or make compact */}
                    <p
                      className={`text-xs sm:text-sm mb-4 sm:mb-6 ${slide.textColor} opacity-90 max-w-lg mx-auto sm:mx-0 px-2 sm:px-0`}
                    >
                      {slide.description}
                    </p>

                    {/* Buttons - Stack on mobile, row on larger screens */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center sm:justify-start px-4 sm:px-0">
                      <Button
                        size="default"
                        className="bg-white text-mmp-primary2 hover:bg-mmp-neutral border-0 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        {slide.cta}
                      </Button>
                      <Button
                        size="default"
                        variant="outline"
                        className={`border-2 ${slide.textColor} hover:bg-white/20 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm w-full sm:w-auto`}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows - Hide on mobile, show on tablet up */}
        <CarouselPrevious className="hidden sm:flex left-2 md:left-4 bg-white/80 hover:bg-white border-0 shadow-lg h-8 w-8 md:h-10 md:w-10" />
        <CarouselNext className="hidden sm:flex right-2 md:right-4 bg-white/80 hover:bg-white border-0 shadow-lg h-8 w-8 md:h-10 md:w-10" />
        
        {/* Optional: Add dot indicators for mobile */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/50 hover:bg-white transition-colors"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                // You'll need to implement dot navigation
                // This would require carousel API access
              }}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}

export default HeroCarousel