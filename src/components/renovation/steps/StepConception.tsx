import React from 'react';
import { useRenovationForm } from '../RenovationFormContext';
import { FormSection } from '../FormSection';
import { FormQuestion } from '../FormQuestion';
import { SelectableCard } from '../SelectableCard';
import { Input } from '@/components/ui/input';
import { Upload, UserCheck, UserX, HelpCircle, CheckCircle, XCircle, Camera } from 'lucide-react';
import { InspirationUpload } from '../InspirationUpload';

export const StepConception: React.FC = () => {
  const { formData, updateFormData } = useRenovationForm();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateFormData('uploadedPlan', file);
  };

  return (
    <FormSection
      title="Avez-vous déjà une idée précise de votre futur intérieur ?"
      subtitle="Comprenons où vous en êtes dans la conception de votre projet"
    >
      {/* Architect collaboration */}
      <FormQuestion label="Collaborez-vous avec un architecte sur ce projet ?" required>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectableCard
            selected={formData.hasArchitect === 'oui'}
            onClick={() => updateFormData('hasArchitect', 'oui')}
            icon={<UserCheck className="w-8 h-8" />}
            title="Oui"
            description="Je travaille déjà avec un architecte"
          />
          <SelectableCard
            selected={formData.hasArchitect === 'non'}
            onClick={() => updateFormData('hasArchitect', 'non')}
            icon={<UserX className="w-8 h-8" />}
            title="Non"
            description="Je n'ai pas d'architecte"
          />
          <SelectableCard
            selected={formData.hasArchitect === 'en-reflexion'}
            onClick={() => updateFormData('hasArchitect', 'en-reflexion')}
            icon={<HelpCircle className="w-8 h-8" />}
            title="En cours de réflexion"
            description="J'y réfléchis encore"
          />
        </div>
      </FormQuestion>

      {/* Modify layout */}
      <FormQuestion label="Souhaitez-vous modifier l'organisation des pièces existantes ?">
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <SelectableCard
            selected={formData.modifyLayout === 'oui'}
            onClick={() => updateFormData('modifyLayout', 'oui')}
            icon={<CheckCircle className="w-6 h-6" />}
            title="Oui"
            size="sm"
          />
          <SelectableCard
            selected={formData.modifyLayout === 'non'}
            onClick={() => updateFormData('modifyLayout', 'non')}
            icon={<XCircle className="w-6 h-6" />}
            title="Non"
            size="sm"
          />
        </div>
      </FormQuestion>

      {/* Show plan upload if modifying layout */}
      {formData.modifyLayout === 'oui' && (
        <FormQuestion 
          label="Vous pouvez joindre un plan existant ou un plan projet"
          hint="Facultatif – formats acceptés : PDF, JPG, PNG"
        >
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all max-w-md">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formData.uploadedPlan 
                  ? formData.uploadedPlan.name 
                  : 'Cliquez pour ajouter un fichier'}
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {formData.uploadedPlan && (
              <button
                type="button"
                onClick={() => updateFormData('uploadedPlan', null)}
                className="text-sm text-destructive hover:underline text-left"
              >
                Supprimer le fichier
              </button>
            )}
          </div>
        </FormQuestion>
      )}

      {/* Inspiration photos upload */}
      <FormQuestion 
        label="Avez-vous des photos d'inspiration ?"
        hint="Partagez des images qui illustrent l'ambiance ou le style que vous recherchez (Pinterest, magazines, photos de projets...)"
      >
        <div className="flex items-start gap-2 mb-4 p-3 bg-secondary/50 rounded-lg">
          <Camera className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Ces photos nous aideront à mieux comprendre vos goûts et à vous proposer des solutions adaptées à vos envies.
          </p>
        </div>
        <InspirationUpload
          images={formData.inspirationImages}
          onImagesChange={(images) => updateFormData('inspirationImages', images)}
          maxImages={10}
          context="projet"
        />
      </FormQuestion>
    </FormSection>
  );
};
