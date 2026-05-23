import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Download, TrendingUp, FileText, Users, Handshake, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminMobileLayout } from "@/components/admin/AdminMobileLayout";

type Range = "7d" | "30d" | "90d" | "all";

interface Metrics {
  totalQuotes: number;
  respondedQuotes: number;
  pendingQuotes: number;
  conversionRate: number; // clients won / total quotes
  responseRate: number;   // responded / total
  totalClients: number;
  wonClients: number;
  totalPartners: number;
  totalSimulations: number;
}

const rangeToDate = (r: Range): string | null => {
  if (r === "all") return null;
  const days = r === "7d" ? 7 : r === "30d" ? 30 : 90;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

const csvEscape = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n;]/.test(s) ? `"${s}"` : s;
};

const downloadCSV = (filename: string, rows: Record<string, unknown>[]) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [range, setRange] = useState<Range>("30d");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({
    totalQuotes: 0,
    respondedQuotes: 0,
    pendingQuotes: 0,
    conversionRate: 0,
    responseRate: 0,
    totalClients: 0,
    wonClients: 0,
    totalPartners: 0,
    totalSimulations: 0,
  });

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data: hasRole } = await supabase.rpc("has_role", {
        _user_id: session.user.id, _role: "admin",
      });
      if (!hasRole) {
        toast({ title: "Accès refusé", variant: "destructive" });
        navigate("/");
        return;
      }
      setIsAdmin(true);
    })();
  }, [navigate, toast]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, range]);

  const fetchMetrics = async () => {
    setLoading(true);
    const since = rangeToDate(range);

    const buildQuery = (table: string, status?: string) => {
      let q = supabase.from(table as any).select("id", { count: "exact", head: true });
      if (since) q = q.gte("created_at", since);
      if (status) q = q.eq("status", status);
      return q;
    };

    try {
      const [
        quotesAll,
        quotesPending,
        clientsAll,
        clientsWon,
        partnersAll,
        simulationsAll,
      ] = await Promise.all([
        buildQuery("quote_requests"),
        buildQuery("quote_requests", "pending"),
        buildQuery("clients"),
        buildQuery("clients", "gagne"),
        buildQuery("partner_requests"),
        buildQuery("renovation_simulations"),
      ]);

      const total = quotesAll.count || 0;
      const pending = quotesPending.count || 0;
      const responded = Math.max(0, total - pending);
      const won = clientsWon.count || 0;

      setMetrics({
        totalQuotes: total,
        respondedQuotes: responded,
        pendingQuotes: pending,
        responseRate: total ? Math.round((responded / total) * 1000) / 10 : 0,
        conversionRate: total ? Math.round((won / total) * 1000) / 10 : 0,
        totalClients: clientsAll.count || 0,
        wonClients: won,
        totalPartners: partnersAll.count || 0,
        totalSimulations: simulationsAll.count || 0,
      });
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur de chargement", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const exportTable = async (
    table: "quote_requests" | "partner_requests" | "renovation_simulations" | "clients",
    filename: string,
  ) => {
    setExporting(table);
    try {
      const since = rangeToDate(range);
      let q = supabase.from(table as any).select("*").order("created_at", { ascending: false });
      if (since) q = q.gte("created_at", since);
      const { data, error } = await q;
      if (error) throw error;
      if (!data || data.length === 0) {
        toast({ title: "Aucune donnée à exporter" });
        return;
      }
      const stamp = new Date().toISOString().slice(0, 10);
      downloadCSV(`${filename}_${range}_${stamp}.csv`, data as unknown as Record<string, unknown>[]);
      toast({ title: `Export CSV : ${data.length} ligne(s)` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Erreur d'export", description: e?.message, variant: "destructive" });
    } finally {
      setExporting(null);
    }
  };

  const ranges: { id: Range; label: string }[] = [
    { id: "7d", label: "7j" },
    { id: "30d", label: "30j" },
    { id: "90d", label: "90j" },
    { id: "all", label: "Tout" },
  ];

  const kpis = [
    { label: "Devis reçus", value: metrics.totalQuotes, icon: FileText, color: "bg-primary/10 text-primary" },
    { label: "Taux de réponse", value: `${metrics.responseRate}%`, icon: TrendingUp, color: "bg-green-500/10 text-green-600", hint: `${metrics.respondedQuotes}/${metrics.totalQuotes}` },
    { label: "Taux de conversion", value: `${metrics.conversionRate}%`, icon: Users, color: "bg-teal-500/10 text-teal-600", hint: `${metrics.wonClients} gagné(s)` },
    { label: "En attente", value: metrics.pendingQuotes, icon: ClipboardList, color: "bg-amber-500/10 text-amber-600" },
    { label: "Partenaires", value: metrics.totalPartners, icon: Handshake, color: "bg-pink-500/10 text-pink-600" },
    { label: "Simulations", value: metrics.totalSimulations, icon: FileText, color: "bg-purple-500/10 text-purple-600" },
  ];

  const exports = [
    { table: "quote_requests" as const, name: "devis", label: "Demandes de devis" },
    { table: "partner_requests" as const, name: "partenaires", label: "Demandes partenaires" },
    { table: "renovation_simulations" as const, name: "simulations", label: "Simulations rénovation" },
    { table: "clients" as const, name: "clients", label: "Clients" },
  ];

  if (isAdmin === null) {
    return (
      <div className="min-h-[100svh] bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Vérification des accès...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Conversions | Administration</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminMobileLayout title="Conversions">
        <div className="p-4 space-y-6">
          {/* Range selector */}
          <div className="flex gap-2 overflow-x-auto">
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium shrink-0 transition-colors ${
                  range === r.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-3">
            {kpis.map((k) => (
              <div key={k.label} className="bg-card border border-border rounded-xl p-4">
                <div className={`w-9 h-9 rounded-lg ${k.color} flex items-center justify-center mb-2`}>
                  <k.icon className="w-4 h-4" />
                </div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "…" : k.value}
                </p>
                {k.hint && <p className="text-xs text-muted-foreground mt-1">{k.hint}</p>}
              </div>
            ))}
          </div>

          {/* CSV exports */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Exports CSV
            </h3>
            <div className="space-y-2">
              {exports.map((e) => (
                <div
                  key={e.table}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{e.label}</p>
                    <p className="text-xs text-muted-foreground">
                      Période : {ranges.find((r) => r.id === range)?.label}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => exportTable(e.table, e.name)}
                    disabled={exporting === e.table}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {exporting === e.table ? "…" : "CSV"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminMobileLayout>
    </>
  );
};

export default AdminAnalytics;