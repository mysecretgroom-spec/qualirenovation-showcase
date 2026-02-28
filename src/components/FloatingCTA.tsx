import { Calendar } from "lucide-react";
import { useState } from "react";
import QuoteModal from "./QuoteModal";

const FloatingCTA = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 bg-gold hover:bg-gold/90 text-primary rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl px-5 py-3.5 sm:px-6 sm:py-4"
        aria-label="Réserver votre créneau"
      >
        <Calendar className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-semibold whitespace-nowrap hidden sm:inline">
          Réserver votre créneau
        </span>
      </button>

      <QuoteModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default FloatingCTA;
