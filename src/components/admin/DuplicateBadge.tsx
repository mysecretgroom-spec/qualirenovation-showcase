import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DuplicateInfo {
  clientId: string;
  clientName: string;
  matchingFields: string[];
  matchScore: number;
}

interface DuplicateBadgeProps {
  duplicate: DuplicateInfo;
}

const DuplicateBadge = ({ duplicate }: DuplicateBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5">
            <Badge 
              variant="outline" 
              className="bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Doublon possible
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">Client existant similaire :</p>
            <p className="text-sm">{duplicate.clientName}</p>
            <p className="text-xs text-muted-foreground">
              Correspondance : {duplicate.matchingFields.join(', ')}
            </p>
            <Link 
              to={`/admin/clients?highlight=${duplicate.clientId}`}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
            >
              Voir la fiche client
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DuplicateBadge;
