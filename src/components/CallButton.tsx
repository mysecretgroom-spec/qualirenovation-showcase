import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const PHONE_NUMBER = "tel:+33183753385";

interface CallButtonProps {
  className?: string;
  variant?: "floating" | "inline";
}

const CallButton = ({ className, variant = "floating" }: CallButtonProps) => {
  if (variant === "inline") {
    return (
      <a
        href={PHONE_NUMBER}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors",
          className
        )}
      >
        <Phone className="w-5 h-5" />
        Appelez-nous
      </a>
    );
  }

  return (
    <a
      href={PHONE_NUMBER}
      className={cn(
        "fixed bottom-6 left-24 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center bg-primary hover:bg-primary/90 hover:scale-110",
        className
      )}
      aria-label="Nous appeler"
    >
      <Phone className="w-7 h-7 text-primary-foreground" />
    </a>
  );
};

export default CallButton;
