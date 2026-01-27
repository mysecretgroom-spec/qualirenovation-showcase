import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LeadProvider } from "@/contexts/LeadContext";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminImport from "./pages/AdminImport";
import AdminQuotes from "./pages/AdminQuotes";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminLinkChecker from "./pages/AdminLinkChecker";
import AdminVisualTesting from "./pages/AdminVisualTesting";
import AdminClients from "./pages/AdminClients";
import AdminPress from "./pages/AdminPress";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CGV from "./pages/CGV";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import MentionsLegales from "./pages/MentionsLegales";
import OnParleDeNous from "./pages/OnParleDeNous";
import FAQPage from "./pages/FAQ";
import RenovationComplete from "./pages/RenovationComplete";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LeadProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projet/:slug" element={<ProjectDetail />} />
              <Route path="/cgv" element={<CGV />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/on-parle-de-nous" element={<OnParleDeNous />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/renovation-complete" element={<RenovationComplete />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/import" element={<AdminImport />} />
              <Route path="/admin/devis" element={<AdminQuotes />} />
              <Route path="/admin/avis" element={<AdminTestimonials />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              <Route path="/admin/liens" element={<AdminLinkChecker />} />
              <Route path="/admin/visual" element={<AdminVisualTesting />} />
              <Route path="/admin/presse" element={<AdminPress />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LeadProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
