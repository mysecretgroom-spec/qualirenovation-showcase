import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Calendar, Newspaper } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PressMention {
  id: string;
  date: string | null;
  source: string;
  source_url: string | null;
  title: string;
  article_url: string;
  logo_url: string | null;
  featured: boolean;
  created_at: string;
}

const sourceColors: Record<string, string> = {
  "Houzz": "bg-green-500/10 text-green-700 border-green-500/20",
  "Houzz UK": "bg-green-500/10 text-green-700 border-green-500/20",
  "Elle Déco": "bg-pink-500/10 text-pink-700 border-pink-500/20",
  "Marie Claire Maison": "bg-red-500/10 text-red-700 border-red-500/20",
  "Huffington Post": "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "18h39": "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "LinkedIn": "bg-sky-500/10 text-sky-700 border-sky-500/20",
};

const OnParlDeNous = () => {
  const [mentions, setMentions] = useState<PressMention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentions = async () => {
      const { data, error } = await supabase
        .from("press_mentions")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data) {
        setMentions(data);
      }
      setLoading(false);
    };

    fetchMentions();
  }, []);

  const getSourceColor = (source: string) => {
    return sourceColors[source] || "bg-muted text-muted-foreground border-border";
  };

  // Group by year
  const groupedMentions = mentions.reduce((acc, mention) => {
    let year = "Autres publications";
    if (mention.date) {
      const match = mention.date.match(/\d{4}/);
      if (match) year = match[0];
    }
    if (!acc[year]) acc[year] = [];
    acc[year].push(mention);
    return acc;
  }, {} as Record<string, PressMention[]>);

  const sortedYears = Object.keys(groupedMentions).sort((a, b) => {
    if (a === "Autres publications") return 1;
    if (b === "Autres publications") return -1;
    return parseInt(b) - parseInt(a);
  });

  return (
    <>
      <Helmet>
        <title>On parle de nous | QualiRénovation - Presse et médias</title>
        <meta 
          name="description" 
          content="Découvrez les articles de presse et publications mentionnant QualiRénovation : Houzz, Elle Déco, Marie Claire Maison, Huffington Post et plus." 
        />
        <link rel="canonical" href="https://qualirenovation.fr/on-parle-de-nous" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Presse & Médias
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              On parle de nous
            </h1>
            <p className="text-lg text-muted-foreground">
              Depuis plus de 10 ans, nos réalisations sont mises en avant dans les plus grands médias 
              de la décoration et de l'aménagement intérieur.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-primary">{mentions.length}+</p>
              <p className="text-sm text-muted-foreground">Publications</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-primary">10+</p>
              <p className="text-sm text-muted-foreground">Années de présence</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-primary">8</p>
              <p className="text-sm text-muted-foreground">Médias différents</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-primary">Houzz</p>
              <p className="text-sm text-muted-foreground">Partenaire principal</p>
            </div>
          </div>

          {/* Featured Sources */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {["Houzz", "Elle Déco", "Marie Claire Maison", "Huffington Post", "18h39"].map((source) => (
              <span 
                key={source}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${getSourceColor(source)}`}
              >
                {source}
              </span>
            ))}
          </div>

          {/* Mentions List */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Chargement...</div>
          ) : (
            <div className="space-y-12 max-w-4xl mx-auto">
              {sortedYears.map((year) => (
                <div key={year}>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    {year}
                  </h2>
                  <div className="grid gap-4">
                    {groupedMentions[year].map((mention) => (
                      <a
                        key={mention.id}
                        href={mention.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Newspaper className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getSourceColor(mention.source)}`}>
                              {mention.source}
                            </span>
                            {mention.date && (
                              <span className="text-xs text-muted-foreground">{mention.date}</span>
                            )}
                            {mention.featured && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gold/10 text-gold-dark border border-gold/20">
                                À la une
                              </span>
                            )}
                          </div>
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {mention.title}
                          </h3>
                        </div>
                        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              Vous êtes journaliste ou blogueur ? Contactez-nous pour toute demande presse.
            </p>
            <a 
              href="mailto:gestion@qualiconcept.fr" 
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              gestion@qualiconcept.fr
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OnParlDeNous;
