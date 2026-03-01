import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Bathroom project images
import img1 from "@/assets/bathroom/ambiance-luxe.jpg";
import img2 from "@/assets/bathroom/ambiance-moderne.jpg";
import img3 from "@/assets/bathroom/ambiance-marbre.jpg";
import img4 from "@/assets/bathroom/ambiance-epure.jpg";
import img5 from "@/assets/bathroom/ambiance-beton-cire.jpg";
import img6 from "@/assets/bathroom/ambiance-zellige.jpg";
import img7 from "@/assets/bathroom/ambiance-nature.jpg";
import img8 from "@/assets/bathroom/ambiance-terrazzo.jpg";
import img9 from "@/assets/projects/avant-apres-sdb.jpg";
import img10 from "@/assets/projects/salle-bain-xxl.jpg";

const slides = [
  { src: img1, alt: "Salle de bain luxe – Paris" },
  { src: img9, alt: "Avant-après salle de bain – Paris" },
  { src: img2, alt: "Salle de bain moderne – Île-de-France" },
  { src: img3, alt: "Salle de bain marbre – Paris" },
  { src: img10, alt: "Grande salle de bain – Paris" },
  { src: img4, alt: "Salle de bain épurée – Paris" },
  { src: img5, alt: "Salle de bain béton ciré – Île-de-France" },
  { src: img6, alt: "Salle de bain zellige – Paris" },
  { src: img7, alt: "Salle de bain naturelle – Paris" },
  { src: img8, alt: "Salle de bain terrazzo – Île-de-France" },
];

const BathroomGalleryCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 4500, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative group">
      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden rounded-xl">
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <div className="relative aspect-[3/4]">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover rounded-xl"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/60 to-transparent p-4 rounded-b-xl">
                  <p className="text-background/80 text-xs font-medium">
                    Projet salle de bain — Paris / Île-de-France
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10",
          "w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md",
          "flex items-center justify-center",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "text-foreground hover:bg-background"
        )}
        aria-label="Photo précédente"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10",
          "w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md",
          "flex items-center justify-center",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "text-foreground hover:bg-background"
        )}
        aria-label="Photo suivante"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              selectedIndex === i
                ? "bg-accent w-5"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Aller à la photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BathroomGalleryCarousel;
