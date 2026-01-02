import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Star, Sparkles } from "lucide-react";
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

// Logos and brand colors for each source
const sourceLogos: Record<string, { logo: string; color: string; bgColor: string }> = {
  "Houzz": { 
    logo: "/houzz-icon.png", 
    color: "#4caf50", 
    bgColor: "bg-[#4caf50]/10" 
  },
  "Houzz UK": { 
    logo: "/houzz-icon.png", 
    color: "#4caf50", 
    bgColor: "bg-[#4caf50]/10" 
  },
  "Elle Déco": { 
    logo: "", 
    color: "#000000", 
    bgColor: "bg-black/5" 
  },
  "Marie Claire Maison": { 
    logo: "", 
    color: "#e53935", 
    bgColor: "bg-red-500/10" 
  },
  "Huffington Post": { 
    logo: "", 
    color: "#0dbe98", 
    bgColor: "bg-emerald-500/10" 
  },
  "18h39": { 
    logo: "", 
    color: "#ff6b35", 
    bgColor: "bg-orange-500/10" 
  },
  "LinkedIn": { 
    logo: "", 
    color: "#0a66c2", 
    bgColor: "bg-blue-600/10" 
  },
};

const OnParlDeNous = () => {
  const [mentions, setMentions] = useState<PressMention[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

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

  const getSourceInfo = (source: string) => {
    return sourceLogos[source] || { logo: "", color: "#888888", bgColor: "bg-muted" };
  };

  // Get unique sources
  const sources = [...new Set(mentions.map(m => m.source))];

  // Filter mentions
  const filteredMentions = selectedSource 
    ? mentions.filter(m => m.source === selectedSource)
    : mentions;

  // Separate featured and regular
  const featuredMentions = filteredMentions.filter(m => m.featured);
  const regularMentions = filteredMentions.filter(m => !m.featured);

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
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-gold/5 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                Presse & Médias
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                On parle de nous
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Depuis plus de 10 ans, nos réalisations sont mises en avant dans les plus grands médias 
                de la décoration et de l'aménagement intérieur.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{mentions.length}+</p>
                <p className="text-sm text-muted-foreground mt-1">Publications</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">10+</p>
                <p className="text-sm text-muted-foreground mt-1">Années de présence</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{sources.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Médias différents</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-sm">
                <div className="w-10 h-10 mx-auto mb-1">
                  <img src="/houzz-icon.png" alt="Houzz" className="w-full h-full object-contain" />
                </div>
                <p className="text-sm text-muted-foreground">Partenaire principal</p>
              </div>
            </div>
          </div>
        </section>

        {/* Source Filters */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedSource(null)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedSource === null 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                Tous les médias
              </button>
              {sources.map((source) => {
                const info = getSourceInfo(source);
                return (
                  <button
                    key={source}
                    onClick={() => setSelectedSource(source)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedSource === source 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                        : `${info.bgColor} hover:opacity-80`
                    }`}
                    style={selectedSource !== source ? { color: info.color } : {}}
                  >
                    {info.logo && (
                      <img src={info.logo} alt={source} className="w-4 h-4 object-contain" />
                    )}
                    {source}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Featured Section */}
                {featuredMentions.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                      <Star className="w-6 h-6 text-gold fill-gold" />
                      <h2 className="text-2xl font-bold text-foreground">À la une</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredMentions.map((mention) => {
                        const info = getSourceInfo(mention.source);
                        return (
                          <a
                            key={mention.id}
                            href={mention.article_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                          >
                            {/* Gradient top bar */}
                            <div 
                              className="h-2 w-full"
                              style={{ backgroundColor: info.color }}
                            />
                            
                            <div className="p-6">
                              {/* Source header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  {info.logo ? (
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
                                      <img 
                                        src={info.logo} 
                                        alt={mention.source} 
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <div 
                                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                                      style={{ backgroundColor: info.color }}
                                    >
                                      {mention.source.charAt(0)}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold text-foreground">{mention.source}</p>
                                    {mention.date && (
                                      <p className="text-sm text-muted-foreground">{mention.date}</p>
                                    )}
                                  </div>
                                </div>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gold/10 text-gold-dark border border-gold/20">
                                  ★ À la une
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors leading-relaxed mb-4 line-clamp-3">
                                {mention.title}
                              </h3>

                              {/* CTA */}
                              <div className="flex items-center gap-2 text-primary font-medium">
                                <span>Lire l'article</span>
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* All Publications */}
                {regularMentions.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-8">
                      {featuredMentions.length > 0 ? "Autres publications" : "Toutes nos publications"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {regularMentions.map((mention) => {
                        const info = getSourceInfo(mention.source);
                        return (
                          <a
                            key={mention.id}
                            href={mention.article_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                          >
                            {/* Source */}
                            <div className="flex items-center gap-2 mb-3">
                              {info.logo ? (
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center p-1.5">
                                  <img 
                                    src={info.logo} 
                                    alt={mention.source} 
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                  style={{ backgroundColor: info.color }}
                                >
                                  {mention.source.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-foreground">{mention.source}</p>
                                {mention.date && (
                                  <p className="text-xs text-muted-foreground">{mention.date}</p>
                                )}
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
                              {mention.title}
                            </h3>

                            {/* Link */}
                            <div className="flex items-center gap-1 text-xs text-primary">
                              <span>Voir l'article</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Media Logos Banner */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
              Ils parlent de nous
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {["Houzz", "Elle Déco", "Marie Claire Maison", "Huffington Post", "18h39"].map((source) => {
                const info = getSourceInfo(source);
                return (
                  <div 
                    key={source}
                    className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {info.logo ? (
                      <img src={info.logo} alt={source} className="w-8 h-8 object-contain" />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: info.color }}
                      >
                        {source.charAt(0)}
                      </div>
                    )}
                    <span className="font-semibold text-foreground">{source}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-gold/5 rounded-3xl p-10 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Contact Presse
              </h2>
              <p className="text-muted-foreground mb-6">
                Vous êtes journaliste ou blogueur ? Contactez-nous pour toute demande presse, 
                interview ou partenariat éditorial.
              </p>
              <a 
                href="mailto:gestion@qualiconcept.fr" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                gestion@qualiconcept.fr
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default OnParlDeNous;
