import { Calendar, FileText } from "lucide-react";
import { useState } from "react";
import QuoteModal from "./QuoteModal";

const FloatingCTA = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile top sticky CTA */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 shadow-md sm:hidden"
        aria-label="Devis gratuit"
      >
        <FileText className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-semibold">Devis gratuit</span>
      </button>

      {/* Desktop floating CTA */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-8 z-[9999] group hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl px-6 py-4"
        aria-label="Réserver votre créneau"
      >
        <Calendar className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-semibold whitespace-nowrap">
          Réserver votre créneau
        </span>
      </button>

      <QuoteModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default FloatingCTA;
