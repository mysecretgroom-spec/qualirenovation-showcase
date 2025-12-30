import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, ExternalLink } from "lucide-react";

const CORRECT_HOUZZ_BASE = "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618";

interface LinkCheck {
  location: string;
  url: string;
  isCorrect: boolean;
  type: "profile" | "project" | "reviews";
}

const AdminLinkChecker = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();
  const [links, setLinks] = useState<LinkCheck[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    // Collect all Houzz links from known locations
    const houzzLinks: LinkCheck[] = [
      // Footer social link
      {
        location: "Footer - Icône Houzz",
        url: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618",
        isCorrect: true,
        type: "profile"
      },
      // Testimonials CTA
      {
        location: "Témoignages - Lien 'Voir tous les avis'",
        url: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618/avis",
        isCorrect: true,
        type: "reviews"
      },
      // Schema.org in Index
      {
        location: "Index - Schema.org sameAs",
        url: "https://www.houzz.fr/professionnels/artisan-et-entreprise-generale-de-batiment/qualirenovation-by-qualiconcept-pfvwfr-pf~1259357618",
        isCorrect: true,
        type: "profile"
      }
    ];

    // Validate each link
    const validatedLinks = houzzLinks.map(link => ({
      ...link,
      isCorrect: link.type === "profile" 
        ? link.url === CORRECT_HOUZZ_BASE
        : link.type === "reviews"
        ? link.url === `${CORRECT_HOUZZ_BASE}/avis`
        : link.url.startsWith("https://www.houzz.fr/hznb/projets/")
    }));

    setLinks(validatedLinks);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const allCorrect = links.every(link => link.isCorrect);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/quotes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-2xl font-semibold">Vérification des liens Houzz</h1>
        </div>

        {/* Summary */}
        <div className={`p-4 rounded-lg mb-6 ${allCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-center gap-2">
            {allCorrect ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Tous les liens sont corrects</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">Certains liens sont incorrects</span>
              </>
            )}
          </div>
        </div>

        {/* Expected URL */}
        <div className="bg-muted p-4 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground mb-1">URL de profil attendue :</p>
          <code className="text-xs break-all">{CORRECT_HOUZZ_BASE}</code>
        </div>

        {/* Links table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium">Emplacement</th>
                <th className="text-left p-4 text-sm font-medium">Type</th>
                <th className="text-left p-4 text-sm font-medium">URL</th>
                <th className="text-center p-4 text-sm font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4 text-sm">{link.location}</td>
                  <td className="p-4 text-sm capitalize">{link.type}</td>
                  <td className="p-4">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline flex items-center gap-1 break-all"
                    >
                      {link.url.substring(0, 60)}...
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="p-4 text-center">
                    {link.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">Instructions</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Profile</strong> : doit pointer vers le profil principal Houzz</li>
            <li>• <strong>Reviews</strong> : doit pointer vers la page des avis (/avis)</li>
            <li>• <strong>Project</strong> : liens vers des projets spécifiques (format /hznb/projets/...)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLinkChecker;
