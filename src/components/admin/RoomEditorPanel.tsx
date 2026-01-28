import { useState } from "react";
import { 
  ChevronLeft, Bath, CookingPot, DoorOpen, 
  Save, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface RoomEditorPanelProps {
  room: any;
  onSave: (updatedRoom: any) => void;
  onCancel: () => void;
}

// Options for bathroom
const bathroomOptions = {
  bathroomType: [
    { value: 'douche', label: 'Douche' },
    { value: 'baignoire', label: 'Baignoire' },
    { value: 'douche-baignoire', label: 'Douche + Baignoire' },
  ],
  showerTrayType: [
    { value: 'a-poser', label: 'À poser' },
    { value: 'encastre', label: 'Encastré' },
    { value: 'carreler', label: 'À carreler' },
    { value: 'resine', label: 'Résine' },
  ],
  showerDoorType: [
    { value: 'fixe', label: 'Fixe' },
    { value: 'battante', label: 'Battante' },
    { value: 'coulissante', label: 'Coulissante' },
    { value: 'pliante', label: 'Pliante' },
  ],
  bathtubType: [
    { value: 'encastree', label: 'Encastrée' },
    { value: 'ilot', label: 'Îlot' },
    { value: 'angle', label: 'Angle' },
    { value: 'droite', label: 'Droite' },
    { value: 'balneo', label: 'Balnéo' },
  ],
  vanityType: [
    { value: 'suspendu', label: 'Suspendu' },
    { value: 'pieds', label: 'Sur pieds' },
    { value: 'vasque-seule', label: 'Vasque seule' },
  ],
  toiletType: [
    { value: 'suspendu', label: 'Suspendu' },
    { value: 'sol', label: 'Au sol' },
    { value: 'sans', label: 'Pas de WC' },
  ],
  mirrorType: [
    { value: 'led', label: 'Avec LED' },
    { value: 'cadre', label: 'Avec cadre' },
    { value: 'rond', label: 'Rond' },
    { value: 'armoire', label: 'Armoire miroir' },
  ],
  faucetFinish: [
    { value: 'chrome', label: 'Chrome' },
    { value: 'noir-mat', label: 'Noir mat' },
    { value: 'laiton-brosse', label: 'Laiton brossé' },
    { value: 'or-brosse', label: 'Or brossé' },
    { value: 'nickel-brosse', label: 'Nickel brossé' },
    { value: 'cuivre', label: 'Cuivre' },
  ],
  ambiance: [
    { value: 'moderne', label: 'Moderne' },
    { value: 'epure', label: 'Épuré' },
    { value: 'nature', label: 'Nature' },
    { value: 'luxe', label: 'Luxe' },
    { value: 'classique', label: 'Classique' },
    { value: 'zellige', label: 'Zellige' },
    { value: 'marbre', label: 'Marbre' },
    { value: 'terrazzo', label: 'Terrazzo' },
  ],
};

// Options for kitchen
const kitchenOptions = {
  layoutType: [
    { value: 'lineaire', label: 'Linéaire' },
    { value: 'l', label: 'En L' },
    { value: 'u', label: 'En U' },
    { value: 'ilot', label: 'Avec îlot' },
  ],
  facadeFinish: [
    { value: 'mat', label: 'Mat' },
    { value: 'laque', label: 'Laqué' },
    { value: 'bois', label: 'Bois' },
    { value: 'effet-matiere', label: 'Effet matière' },
  ],
  countertopMaterial: [
    { value: 'stratifie', label: 'Stratifié' },
    { value: 'quartz', label: 'Quartz' },
    { value: 'ceramique', label: 'Céramique' },
    { value: 'bois', label: 'Bois' },
  ],
  backsplashType: [
    { value: 'carrelage', label: 'Carrelage' },
    { value: 'verre', label: 'Verre' },
    { value: 'pleine-hauteur', label: 'Pleine hauteur' },
    { value: 'sans', label: 'Sans crédence' },
  ],
};

// Options for WC
const wcOptions = {
  toiletType: [
    { value: 'suspendu', label: 'Suspendu' },
    { value: 'sol', label: 'Au sol' },
  ],
  handWashType: [
    { value: 'angle', label: 'Angle' },
    { value: 'suspendu', label: 'Suspendu' },
    { value: 'totem', label: 'Totem' },
    { value: 'plan-vasque', label: 'Plan vasque' },
    { value: 'sans', label: 'Sans lave-main' },
  ],
  faucetFinish: bathroomOptions.faucetFinish,
};

const RoomEditorPanel = ({ room, onSave, onCancel }: RoomEditorPanelProps) => {
  const [roomData, setRoomData] = useState(room.data || {});

  const getRoomIcon = () => {
    switch (room.type) {
      case 'cuisine': return <CookingPot className="w-5 h-5" />;
      case 'salle-de-bain': return <Bath className="w-5 h-5" />;
      case 'wc': return <DoorOpen className="w-5 h-5" />;
      default: return <DoorOpen className="w-5 h-5" />;
    }
  };

  const getRoomLabel = () => {
    const labels: Record<string, string> = {
      'cuisine': 'Cuisine',
      'salle-de-bain': 'Salle de bain',
      'wc': 'WC',
    };
    return labels[room.type] || room.type;
  };

  const updateField = (category: string, field: string, value: any) => {
    setRoomData((prev: any) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [field]: value,
      },
    }));
  };

  const toggleArrayItem = (category: string, field: string, value: string) => {
    const current = (roomData[category]?.[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    updateField(category, field, updated);
  };

  const handleSave = () => {
    onSave({ ...room, data: roomData });
  };

  const renderBathroomEditor = () => {
    const data = roomData.bathroomData || {};
    return (
      <div className="space-y-6">
        {/* Type de salle de bain */}
        <div className="space-y-2">
          <Label>Type d'installation</Label>
          <Select
            value={data.bathroomType || ''}
            onValueChange={(v) => updateField('bathroomData', 'bathroomType', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {bathroomOptions.bathroomType.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Douche options */}
        {['douche', 'douche-baignoire'].includes(data.bathroomType) && (
          <div className="grid sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="col-span-full text-sm font-medium text-muted-foreground">Options Douche</h4>
            <div className="space-y-2">
              <Label>Receveur</Label>
              <Select
                value={data.showerTrayType || ''}
                onValueChange={(v) => updateField('bathroomData', 'showerTrayType', v)}
              >
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {bathroomOptions.showerTrayType.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Paroi</Label>
              <Select
                value={data.showerDoorType || ''}
                onValueChange={(v) => updateField('bathroomData', 'showerDoorType', v)}
              >
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {bathroomOptions.showerDoorType.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Baignoire options */}
        {['baignoire', 'douche-baignoire'].includes(data.bathroomType) && (
          <div className="grid sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="col-span-full text-sm font-medium text-muted-foreground">Options Baignoire</h4>
            <div className="space-y-2">
              <Label>Type de baignoire</Label>
              <Select
                value={data.bathtubType || ''}
                onValueChange={(v) => updateField('bathroomData', 'bathtubType', v)}
              >
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {bathroomOptions.bathtubType.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Meuble vasque */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Meuble vasque</Label>
            <Select
              value={data.vanityType || ''}
              onValueChange={(v) => updateField('bathroomData', 'vanityType', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {bathroomOptions.vanityType.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Miroir</Label>
            <Select
              value={data.mirrorType || ''}
              onValueChange={(v) => updateField('bathroomData', 'mirrorType', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {bathroomOptions.mirrorType.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* WC et finitions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>WC</Label>
            <Select
              value={data.toiletType || ''}
              onValueChange={(v) => updateField('bathroomData', 'toiletType', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {bathroomOptions.toiletType.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Finition robinetterie</Label>
            <Select
              value={data.faucetFinish || ''}
              onValueChange={(v) => updateField('bathroomData', 'faucetFinish', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {bathroomOptions.faucetFinish.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ambiance */}
        <div className="space-y-2">
          <Label>Ambiance(s)</Label>
          <div className="flex flex-wrap gap-2">
            {bathroomOptions.ambiance.map(opt => (
              <Badge
                key={opt.value}
                variant={(data.ambiance || []).includes(opt.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayItem('bathroomData', 'ambiance', opt.value)}
              >
                {opt.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderKitchenEditor = () => {
    const data = roomData.kitchenData || {};
    return (
      <div className="space-y-6">
        {/* Layout */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Implantation</Label>
            <Select
              value={data.layoutType || ''}
              onValueChange={(v) => updateField('kitchenData', 'layoutType', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {kitchenOptions.layoutType.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Finition façades</Label>
            <Select
              value={data.facadeFinish || ''}
              onValueChange={(v) => updateField('kitchenData', 'facadeFinish', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {kitchenOptions.facadeFinish.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Plan de travail et crédence */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Plan de travail</Label>
            <Select
              value={data.countertopMaterial || ''}
              onValueChange={(v) => updateField('kitchenData', 'countertopMaterial', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {kitchenOptions.countertopMaterial.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Crédence</Label>
            <Select
              value={data.backsplashType || ''}
              onValueChange={(v) => updateField('kitchenData', 'backsplashType', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {kitchenOptions.backsplashType.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Poignées */}
        <div className="space-y-2">
          <Label>Poignées</Label>
          <Select
            value={data.hasHandles || ''}
            onValueChange={(v) => updateField('kitchenData', 'hasHandles', v)}
          >
            <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="oui">Avec poignées</SelectItem>
              <SelectItem value="non">Sans poignées (push-to-open)</SelectItem>
              <SelectItem value="ne-sais-pas">Je ne sais pas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderWCEditor = () => {
    const data = roomData.wcData || {};
    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type de WC</Label>
            <Select
              value={data.toiletType || ''}
              onValueChange={(v) => updateField('wcData', 'toiletType', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {wcOptions.toiletType.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Lave-main</Label>
            <Select
              value={data.handWashType || ''}
              onValueChange={(v) => updateField('wcData', 'handWashType', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {wcOptions.handWashType.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {data.handWashType && data.handWashType !== 'sans' && (
          <div className="space-y-2">
            <Label>Finition robinetterie</Label>
            <Select
              value={data.faucetFinish || ''}
              onValueChange={(v) => updateField('wcData', 'faucetFinish', v)}
            >
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {wcOptions.faucetFinish.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Sanibroyeur existant</Label>
          <Select
            value={data.existingSanibroyeur || ''}
            onValueChange={(v) => updateField('wcData', 'existingSanibroyeur', v)}
          >
            <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="oui">Oui</SelectItem>
              <SelectItem value="non">Non</SelectItem>
              <SelectItem value="ne-sais-pas">Je ne sais pas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderRoomEditor = () => {
    switch (room.type) {
      case 'salle-de-bain': return renderBathroomEditor();
      case 'cuisine': return renderKitchenEditor();
      case 'wc': return renderWCEditor();
      default: return (
        <p className="text-sm text-muted-foreground py-8 text-center">
          L'édition détaillée pour ce type de pièce n'est pas encore disponible.
        </p>
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Retour
        </Button>
        <div className="flex items-center gap-2">
          {getRoomIcon()}
          <span className="font-medium">
            {getRoomLabel()} {room.instanceNumber > 1 ? room.instanceNumber : ''}
          </span>
        </div>
      </div>

      {/* Room editor content */}
      {renderRoomEditor()}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Annuler
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-1" />
          Appliquer
        </Button>
      </div>
    </div>
  );
};

export default RoomEditorPanel;
