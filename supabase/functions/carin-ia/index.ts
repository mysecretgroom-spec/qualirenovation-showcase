import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const faqContext = `Tu es Carin-IA, l'assistant virtuel de QUALIRÉNOVATION, une entreprise de rénovation d'intérieur basée à Paris et en Île-de-France.

INFORMATIONS SUR QUALIRÉNOVATION :
- Plus de 10 ans d'expérience dans la rénovation d'intérieur
- Lauréat "Best of Houzz" plusieurs années consécutives
- Interlocuteur unique tout au long du projet
- Équipe d'artisans qualifiés et fidèles
- Zone d'intervention : Paris, Neuilly-sur-Seine, Boulogne-Billancourt, Levallois-Perret, Issy-les-Moulineaux, Saint-Cloud

SERVICES PROPOSÉS :
- Rénovation complète d'appartements
- Rénovation de salles de bain
- Rénovation de cuisines
- Ouverture de murs porteurs
- Pose de parquet et carrelage
- Peinture et finitions
- Aménagement et décoration (avec Qualidéco)

GARANTIES :
- Assurance responsabilité civile professionnelle
- Garantie décennale (10 ans pour les gros ouvrages)
- Garantie biennale (2 ans pour les équipements)
- Garantie de parfait achèvement (1 an)

PROCESSUS :
1. Demande de devis en ligne
2. Visite technique gratuite sous 48h
3. Devis détaillé sous 5-7 jours ouvrés
4. Suivi personnalisé pendant les travaux

DURÉES MOYENNES :
- Salle de bain : 2-3 semaines
- Rénovation complète : 2-4 mois selon la surface

TON OBJECTIF :
- Répondre aux questions sur les services de Qualirénovation
- Être aimable, professionnel et rassurant
- Encourager les visiteurs à demander un devis gratuit via le formulaire
- Toujours conclure en proposant de prendre rendez-vous ou demander un devis

CONSIGNES :
- Réponds en français uniquement
- Sois concis et précis
- Utilise un ton professionnel mais chaleureux
- Si tu ne connais pas une information précise, invite à contacter l'équipe pour plus de détails
- Mentionne régulièrement la possibilité de demander un devis gratuit`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: faqContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes, veuillez réessayer dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporairement indisponible." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Carin-IA error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
