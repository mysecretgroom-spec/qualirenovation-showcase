import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Eye, Layers, AlertTriangle, CheckCircle } from "lucide-react";

interface Screenshot {
  id: string;
  browser: string;
  file: File;
  url: string;
  timestamp: Date;
}

const BROWSERS = [
  { value: "chrome-mac", label: "Chrome (Mac)" },
  { value: "safari-mac", label: "Safari (Mac)" },
  { value: "chrome-windows", label: "Chrome (Windows)" },
  { value: "edge-windows", label: "Edge (Windows)" },
  { value: "safari-ios", label: "Safari (iOS)" },
  { value: "chrome-android", label: "Chrome (Android)" },
];

const AdminVisualTesting = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [selectedBrowser, setSelectedBrowser] = useState<string>("");
  const [compareMode, setCompareMode] = useState<"side-by-side" | "overlay" | "diff">("side-by-side");
  const [overlayOpacity, setOverlayOpacity] = useState([50]);
  const [compareImages, setCompareImages] = useState<{ a: Screenshot | null; b: Screenshot | null }>({ a: null, b: null });
  const [diffResult, setDiffResult] = useState<{ percentage: number; diffUrl: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedBrowser) return;

    Array.from(files).forEach((file) => {
      const screenshot: Screenshot = {
        id: crypto.randomUUID(),
        browser: selectedBrowser,
        file,
        url: URL.createObjectURL(file),
        timestamp: new Date(),
      };
      setScreenshots((prev) => [...prev, screenshot]);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeScreenshot = (id: string) => {
    setScreenshots((prev) => {
      const screenshot = prev.find((s) => s.id === id);
      if (screenshot) {
        URL.revokeObjectURL(screenshot.url);
      }
      return prev.filter((s) => s.id !== id);
    });
    if (compareImages.a?.id === id) setCompareImages((prev) => ({ ...prev, a: null }));
    if (compareImages.b?.id === id) setCompareImages((prev) => ({ ...prev, b: null }));
  };

  const selectForComparison = (screenshot: Screenshot, slot: "a" | "b") => {
    setCompareImages((prev) => ({ ...prev, [slot]: screenshot }));
    setDiffResult(null);
  };

  const calculateDiff = async () => {
    if (!compareImages.a || !compareImages.b || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgA = new Image();
    const imgB = new Image();

    await Promise.all([
      new Promise<void>((resolve) => {
        imgA.onload = () => resolve();
        imgA.src = compareImages.a!.url;
      }),
      new Promise<void>((resolve) => {
        imgB.onload = () => resolve();
        imgB.src = compareImages.b!.url;
      }),
    ]);

    const width = Math.max(imgA.width, imgB.width);
    const height = Math.max(imgA.height, imgB.height);
    canvas.width = width;
    canvas.height = height;

    // Draw image A
    ctx.drawImage(imgA, 0, 0);
    const dataA = ctx.getImageData(0, 0, width, height);

    // Draw image B
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(imgB, 0, 0);
    const dataB = ctx.getImageData(0, 0, width, height);

    // Calculate diff
    const diffData = ctx.createImageData(width, height);
    let diffPixels = 0;
    const totalPixels = width * height;

    for (let i = 0; i < dataA.data.length; i += 4) {
      const rDiff = Math.abs(dataA.data[i] - dataB.data[i]);
      const gDiff = Math.abs(dataA.data[i + 1] - dataB.data[i + 1]);
      const bDiff = Math.abs(dataA.data[i + 2] - dataB.data[i + 2]);

      const isDiff = rDiff > 10 || gDiff > 10 || bDiff > 10;

      if (isDiff) {
        diffPixels++;
        diffData.data[i] = 255; // Red
        diffData.data[i + 1] = 0;
        diffData.data[i + 2] = 0;
        diffData.data[i + 3] = 200;
      } else {
        diffData.data[i] = dataA.data[i];
        diffData.data[i + 1] = dataA.data[i + 1];
        diffData.data[i + 2] = dataA.data[i + 2];
        diffData.data[i + 3] = 50;
      }
    }

    ctx.putImageData(diffData, 0, 0);
    const diffUrl = canvas.toDataURL();
    const percentage = (diffPixels / totalPixels) * 100;

    setDiffResult({ percentage, diffUrl });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au site
        </Button>

        <h1 className="text-3xl font-display font-bold mb-2">Test Visuel Cross-Browser</h1>
        <p className="text-muted-foreground mb-8">
          Uploadez des screenshots du site depuis différents navigateurs pour détecter les variations visuelles.
        </p>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Uploader un Screenshot
            </CardTitle>
            <CardDescription>
              Sélectionnez le navigateur puis uploadez une capture d'écran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Navigateur</label>
                <Select value={selectedBrowser} onValueChange={setSelectedBrowser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un navigateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {BROWSERS.map((browser) => (
                      <SelectItem key={browser.value} value={browser.value}>
                        {browser.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="screenshot-upload"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedBrowser}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Uploader
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screenshots Grid */}
        {screenshots.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Screenshots ({screenshots.length})</CardTitle>
              <CardDescription>
                Cliquez sur une image pour la sélectionner pour la comparaison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {screenshots.map((screenshot) => (
                  <div
                    key={screenshot.id}
                    className={`relative group border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      compareImages.a?.id === screenshot.id
                        ? "ring-2 ring-primary"
                        : compareImages.b?.id === screenshot.id
                        ? "ring-2 ring-secondary"
                        : "hover:ring-2 hover:ring-muted"
                    }`}
                  >
                    <img
                      src={screenshot.url}
                      alt={`Screenshot ${screenshot.browser}`}
                      className="w-full h-32 object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => selectForComparison(screenshot, "a")}
                      >
                        A
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => selectForComparison(screenshot, "b")}
                      >
                        B
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {BROWSERS.find((b) => b.value === screenshot.browser)?.label || screenshot.browser}
                      </Badge>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeScreenshot(screenshot.id);
                      }}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    {compareImages.a?.id === screenshot.id && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-primary">Image A</Badge>
                      </div>
                    )}
                    {compareImages.b?.id === screenshot.id && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-secondary">Image B</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Section */}
        {(compareImages.a || compareImages.b) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Comparaison
              </CardTitle>
              <CardDescription>
                Comparez les deux screenshots sélectionnés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex gap-2">
                  <Button
                    variant={compareMode === "side-by-side" ? "default" : "outline"}
                    onClick={() => setCompareMode("side-by-side")}
                  >
                    Côte à côte
                  </Button>
                  <Button
                    variant={compareMode === "overlay" ? "default" : "outline"}
                    onClick={() => setCompareMode("overlay")}
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Superposition
                  </Button>
                  <Button
                    variant={compareMode === "diff" ? "default" : "outline"}
                    onClick={() => {
                      setCompareMode("diff");
                      if (compareImages.a && compareImages.b) {
                        calculateDiff();
                      }
                    }}
                    disabled={!compareImages.a || !compareImages.b}
                  >
                    Différences
                  </Button>
                </div>

                {compareMode === "overlay" && (
                  <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                    <span className="text-sm text-muted-foreground">Opacité B:</span>
                    <Slider
                      value={overlayOpacity}
                      onValueChange={setOverlayOpacity}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono">{overlayOpacity[0]}%</span>
                  </div>
                )}
              </div>

              {/* Diff Result */}
              {compareMode === "diff" && diffResult && (
                <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
                  diffResult.percentage < 0.1 
                    ? "bg-green-500/10 text-green-700" 
                    : diffResult.percentage < 1 
                    ? "bg-yellow-500/10 text-yellow-700"
                    : "bg-red-500/10 text-red-700"
                }`}>
                  {diffResult.percentage < 0.1 ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                  <span className="font-medium">
                    {diffResult.percentage < 0.1
                      ? "Images identiques"
                      : `${diffResult.percentage.toFixed(2)}% de différence détectée`}
                  </span>
                </div>
              )}

              {/* Comparison Display */}
              <div className={`relative ${compareMode === "side-by-side" ? "grid grid-cols-2 gap-4" : ""}`}>
                {compareMode === "side-by-side" ? (
                  <>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-2 text-sm font-medium">
                        Image A: {compareImages.a ? BROWSERS.find((b) => b.value === compareImages.a?.browser)?.label : "Non sélectionnée"}
                      </div>
                      {compareImages.a ? (
                        <img src={compareImages.a.url} alt="Image A" className="w-full" />
                      ) : (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">
                          Sélectionnez une image
                        </div>
                      )}
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-2 text-sm font-medium">
                        Image B: {compareImages.b ? BROWSERS.find((b) => b.value === compareImages.b?.browser)?.label : "Non sélectionnée"}
                      </div>
                      {compareImages.b ? (
                        <img src={compareImages.b.url} alt="Image B" className="w-full" />
                      ) : (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">
                          Sélectionnez une image
                        </div>
                      )}
                    </div>
                  </>
                ) : compareMode === "overlay" ? (
                  <div className="relative border rounded-lg overflow-hidden">
                    {compareImages.a && (
                      <img src={compareImages.a.url} alt="Image A" className="w-full" />
                    )}
                    {compareImages.b && (
                      <img
                        src={compareImages.b.url}
                        alt="Image B"
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{ opacity: overlayOpacity[0] / 100 }}
                      />
                    )}
                    {!compareImages.a && !compareImages.b && (
                      <div className="h-48 flex items-center justify-center text-muted-foreground">
                        Sélectionnez deux images
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    {diffResult ? (
                      <img src={diffResult.diffUrl} alt="Différences" className="w-full" />
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground">
                        Sélectionnez deux images pour calculer les différences
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Ouvrez le site sur différents navigateurs (Chrome Mac, Safari, Edge, etc.)</li>
              <li>Prenez une capture d'écran de la même page sur chaque navigateur</li>
              <li>Uploadez chaque screenshot en sélectionnant le navigateur correspondant</li>
              <li>Sélectionnez deux images (A et B) pour les comparer</li>
              <li>Utilisez le mode "Différences" pour détecter automatiquement les variations</li>
              <li>Un pourcentage de différence inférieur à 0.1% indique des images identiques</li>
            </ol>
          </CardContent>
        </Card>

        {/* Hidden canvas for diff calculation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default AdminVisualTesting;
