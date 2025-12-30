import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import AdminImport from "./pages/AdminImport";
import AdminQuotes from "./pages/AdminQuotes";
import AdminTestimonials from "./pages/AdminTestimonials";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CGV from "./pages/CGV";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import FAQPage from "./pages/FAQ";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projet/:slug" element={<ProjectDetail />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/import" element={<AdminImport />} />
            <Route path="/admin/devis" element={<AdminQuotes />} />
            <Route path="/admin/avis" element={<AdminTestimonials />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
