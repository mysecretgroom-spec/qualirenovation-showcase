
# Plan de correction des outils de scraping et améliorations visuelles

## Analyse des problèmes identifiés

### 1. Scrapers fonctionnels mais mal intégrés
Les tests API montrent que les scrapers fonctionnent correctement :
- **Farrow & Ball** : Retourne `imageUrl`, `hexColor`, `productUrl` correctement
- **EGGER** : Retourne `imageUrl`, `decorName`, `decorUrl` correctement
- **Planizia** : Fonctionne aussi

**Problème identifié dans GlobalPaintingModule.tsx** : 
- Ligne 122-132 : L'update crée un nouveau tableau `[...currentColors, {...}]` au lieu de modifier l'élément en cours de chargement
- La référence n'est pas correctement mise à jour car `currentColors` est capturé avant l'ajout du placeholder

### 2. Images trop petites (miroirs, WC, parois de douche)
Le composant `SelectableCard.tsx` utilise des tailles d'images insuffisantes :
- `sm: h-16` (64px), `md: h-24` (96px), `lg: h-32` (128px), `xl: h-40` (160px)
- Les miroirs et WC utilisent `size="lg"` ou `size="md"` ce qui est trop petit

### 3. Modules Peinture/Sol/Électricité doivent être autonomes
Actuellement intégrés dans `LivingRoomModule`, ils doivent être présentés comme des étapes séparées après la sélection des pièces avec la question "Avez-vous besoin de travaux de peinture/sol/électricité ?"

---

## Plan de correction

### Partie 1 : Corriger le scraper Farrow & Ball (GlobalPaintingModule.tsx)

**Fichier** : `src/components/renovation/modules/GlobalPaintingModule.tsx`

**Problème** : Race condition dans `addFarrowBallColor` - la closure capture `currentColors` avant l'update

**Solution** :
```typescript
// Utiliser une ref ou un callback fonctionnel pour l'update
const addFarrowBallColor = async () => {
  // ... validation ...
  
  // 1. Ajouter le placeholder avec loading
  onUpdate({ 
    farrowBallColors: [...(data.farrowBallColors || []), loadingColor] 
  });
  
  // 2. Après le scrape, utiliser une fonction de mise à jour qui lit l'état actuel
  // et remplace l'élément loading par le résultat
  const updatedColors = [...(data.farrowBallColors || [])].map((c, i) => 
    i === loadingIndex && c.isLoading 
      ? { ...resultFromScrape, isLoading: false }
      : c
  );
  onUpdate({ farrowBallColors: updatedColors });
};
```

Cependant, comme `onUpdate` n'a pas accès à l'état précédent, il faut restructurer pour utiliser `data.farrowBallColors` au moment de l'update.

### Partie 2 : Corriger les scrapers dans les autres modules

**Fichiers à vérifier** :
- `src/components/renovation/modules/KitchenModule.tsx` (EGGER, Planizia)
- `src/components/renovation/modules/BathroomModule.tsx` (EGGER)

Les mêmes corrections doivent être appliquées pour s'assurer que l'update utilise l'état courant et non une closure périmée.

### Partie 3 : Augmenter la taille des images

**Fichier** : `src/components/renovation/SelectableCard.tsx`

**Modifications** :
1. Ajouter une nouvelle taille `xxl` pour les grandes images
2. Augmenter les dimensions existantes

```typescript
const imageSizeClasses = {
  sm: 'h-20',      // 80px (était 64px)
  md: 'h-28',      // 112px (était 96px)
  lg: 'h-40',      // 160px (était 128px)
  xl: 'h-52',      // 208px (était 160px)
  xxl: 'h-64',     // 256px (nouveau)
};
```

**Fichiers à modifier pour utiliser les nouvelles tailles** :
- `WCModule.tsx` : Utiliser `size="xl"` pour les lave-mains et siphons
- `BathroomModule.tsx` : Utiliser `size="xl"` ou `size="xxl"` pour les miroirs et parois

### Partie 4 : Régénérer les images trop petites

Les images suivantes doivent être régénérées en plus haute résolution :
- `miroir-led.jpg`, `miroir-cadre.jpg`, `miroir-rond.jpg`, `miroir-armoire.jpg`
- `lave-main-angle.jpg`, `lave-main-suspendu.jpg`, `lave-main-totem.jpg`, `plan-vasque.jpg`
- `siphon-design.jpg`, `siphon-gain-place.jpg`, `siphon-classique.jpg`

### Partie 5 : Restructurer les modules Sol/Peinture/Électricité comme étapes autonomes

**Modifications dans RenovationForm.tsx** :

1. Après l'étape de sélection des pièces, ajouter 3 nouvelles questions :
   - "Avez-vous besoin de travaux de peinture ?" (oui/non)
   - "Avez-vous besoin de travaux de sols ?" (oui/non)
   - "Avez-vous besoin de travaux d'électricité ?" (oui/non)

2. Ajouter les données globales dans le contexte :
```typescript
// Dans types.ts - déjà fait
globalFlooring: GlobalFlooringData;
globalPainting: GlobalPaintingData;
globalElectricity: GlobalElectricityData;
```

3. Modifier la séquence des étapes dans `RenovationForm.tsx` :
```typescript
const stepConfig = useMemo(() => {
  const steps = [
    // ... étapes existantes ...
    { id: 'room-selection', component: <StepRoomSelection /> },
  ];

  // Modules de pièces individuelles
  formData.selectedRooms.forEach((room) => {
    // ... code existant ...
  });

  // Ajouter les modules globaux après les pièces
  if (formData.needsGlobalPainting) {
    steps.push({ 
      id: 'global-painting', 
      component: <GlobalPaintingModule data={...} onUpdate={...} />,
      isSkippable: true 
    });
  }
  if (formData.needsGlobalFlooring) {
    steps.push({ 
      id: 'global-flooring', 
      component: <GlobalFlooringModule data={...} onUpdate={...} />,
      isSkippable: true 
    });
  }
  if (formData.needsGlobalElectricity) {
    steps.push({ 
      id: 'global-electricity', 
      component: <GlobalElectricityModule data={...} onUpdate={...} />,
      isSkippable: true 
    });
  }

  // Isolation et conditions
  if (formData.projectTypes.includes('dpe')) {
    steps.push({ id: 'isolation', component: <StepIsolation /> });
  }
  steps.push({ id: 'conditions', component: <StepConditions /> });

  return steps;
});
```

4. Créer une nouvelle étape `StepGlobalWorksSelection.tsx` :
```typescript
// Nouvelle étape pour demander quels travaux globaux sont nécessaires
export const StepGlobalWorksSelection: React.FC = () => {
  const { formData, updateFormData } = useRenovationForm();
  
  return (
    <FormSection title="Travaux transversaux" subtitle="...">
      <FormQuestion label="Avez-vous besoin de travaux de peinture ?">
        {/* Oui/Non cards */}
      </FormQuestion>
      <FormQuestion label="Avez-vous besoin de travaux de sols ?">
        {/* Oui/Non cards */}
      </FormQuestion>
      <FormQuestion label="Avez-vous besoin de travaux d'électricité ?">
        {/* Oui/Non cards */}
      </FormQuestion>
    </FormSection>
  );
};
```

5. Ajouter les champs dans `RenovationFormData` :
```typescript
interface RenovationFormData {
  // ... existant ...
  needsGlobalPainting: boolean;
  needsGlobalFlooring: boolean;
  needsGlobalElectricity: boolean;
  globalPainting: GlobalPaintingData;
  globalFlooring: GlobalFlooringData;
  globalElectricity: GlobalElectricityData;
}
```

---

## Détails techniques de l'implémentation

### Correction du bug de scraping Farrow & Ball

Le problème principal est que `onUpdate` est appelé avec des données basées sur `currentColors` qui est capturé au début de la fonction. Quand le scrape se termine, `data.farrowBallColors` a déjà été mis à jour avec le placeholder loading, mais la closure utilise toujours l'ancienne valeur.

**Solution correcte** :
```typescript
const addFarrowBallColor = async () => {
  if (!newColorRef.trim()) return;
  
  const colorRef = newColorRef.trim();
  const match = colorRef.match(/^(?:No\.?\s*)?(\d+)?\s*(.+)?$/i);
  const colorNumber = match?.[1] || '';
  const colorName = match?.[2]?.trim() || '';
  const roomsToAssign = [...selectedColorRooms];
  
  // Générer un ID unique pour identifier cette couleur
  const tempId = `temp-${Date.now()}`;
  
  const loadingColor: FarrowBallColor = {
    colorNumber: colorNumber,
    colorName: colorName || colorRef,
    rooms: roomsToAssign,
    isLoading: true,
    _tempId: tempId, // Identifiant temporaire
  };
  
  onUpdate({ farrowBallColors: [...(data.farrowBallColors || []), loadingColor] });
  
  setNewColorRef('');
  setSelectedColorRooms([]);

  try {
    const { data: scrapeData, error } = await supabase.functions.invoke('scrape-farrow-ball', {
      body: { colorReference: colorRef },
    });

    if (error) throw error;

    // Mettre à jour en utilisant l'état actuel via un callback
    // Note: On doit passer par le parent pour accéder à l'état actuel
    onUpdate({ 
      farrowBallColors: data.farrowBallColors.map(c => 
        c._tempId === tempId 
          ? {
              colorNumber: scrapeData?.colorNumber || colorNumber,
              colorName: scrapeData?.colorName || colorName || colorRef,
              rooms: roomsToAssign,
              imageUrl: scrapeData?.imageUrl,
              hexColor: scrapeData?.hexColor,
              productUrl: scrapeData?.productUrl,
              isLoading: false,
            }
          : c
      )
    });
    
    // ... toast ...
  } catch (error) {
    // ... error handling ...
  }
};
```

Problème : `data.farrowBallColors` dans le callback est toujours l'ancienne valeur. 

**Solution alternative** : Utiliser `useCallback` avec dépendance sur `data.farrowBallColors` ou passer une fonction de mise à jour au lieu d'un objet.

La solution la plus propre est de modifier le parent pour qu'il passe une fonction `onUpdate` qui accepte un callback :
```typescript
// Au lieu de: onUpdate({ farrowBallColors: newArray })
// Utiliser: onUpdate(prev => ({ ...prev, farrowBallColors: newArray }))
```

Mais cela nécessite de modifier l'interface. Une solution plus simple est de stocker la référence de l'index avant l'async et de lire `data` au moment de l'update.

---

## Fichiers à modifier

| Fichier | Modifications |
|---------|---------------|
| `src/components/renovation/SelectableCard.tsx` | Augmenter les tailles d'images, ajouter `xxl` |
| `src/components/renovation/modules/GlobalPaintingModule.tsx` | Corriger le bug de mise à jour asynchrone |
| `src/components/renovation/modules/KitchenModule.tsx` | Appliquer la même correction aux scrapers |
| `src/components/renovation/modules/BathroomModule.tsx` | Appliquer la même correction, augmenter taille miroirs |
| `src/components/renovation/modules/WCModule.tsx` | Augmenter taille des images lave-mains/siphons |
| `src/components/renovation/types.ts` | Ajouter `needsGlobalPainting`, `needsGlobalFlooring`, `needsGlobalElectricity` |
| `src/components/renovation/RenovationFormContext.tsx` | Ajouter les états globaux |
| `src/components/renovation/RenovationForm.tsx` | Intégrer les modules globaux comme étapes séparées |
| `src/components/renovation/steps/StepGlobalWorksSelection.tsx` | Nouvelle étape (à créer) |
| Images (via AI generation) | Régénérer miroirs et WC en plus haute résolution |

---

## Ordre d'implémentation recommandé

1. **Phase 1** - Corriger les scrapers
   - Modifier `GlobalPaintingModule.tsx` pour corriger le bug async
   - Appliquer aux autres modules (Kitchen, Bathroom)

2. **Phase 2** - Améliorer les images
   - Modifier `SelectableCard.tsx` pour les nouvelles tailles
   - Régénérer les images des miroirs et WC
   - Mettre à jour les modules pour utiliser les bonnes tailles

3. **Phase 3** - Restructurer les modules globaux
   - Ajouter les types et états
   - Créer l'étape de sélection des travaux globaux
   - Intégrer dans le flux du formulaire

