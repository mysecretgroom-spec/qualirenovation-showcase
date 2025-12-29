import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { projects as staticProjects, categories as staticCategories, Project } from "@/data/projects";

export interface DBProject {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  image_count: number | null;
  houzz_url: string | null;
  year: string | null;
  created_at: string;
}

export interface DBProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  image_order: number;
  caption: string | null;
}

// Convert DB project to app format
function dbToAppProject(dbProject: DBProject, images: DBProjectImage[]): Project {
  const sortedImages = images.sort((a, b) => (a.image_order || 0) - (b.image_order || 0));
  const mainImage = sortedImages[0]?.image_url || "/placeholder.svg";
  const gallery = sortedImages.slice(1).map(img => img.image_url);

  return {
    id: parseInt(dbProject.id.replace(/-/g, '').substring(0, 8), 16) || Date.now(),
    slug: dbProject.slug,
    title: dbProject.title,
    category: dbProject.category || "Rénovation complète",
    location: dbProject.location || "Paris",
    image: mainImage,
    photoCount: dbProject.image_count || images.length,
    houzzUrl: dbProject.houzz_url || "#",
    year: dbProject.year || new Date().getFullYear().toString(),
    budget: "Sur devis",
    description: dbProject.description || "Projet de rénovation réalisé par QualiRénovation.",
    highlights: extractHighlights(dbProject.description || ""),
    services: extractServices(dbProject.category || "Rénovation"),
    gallery,
  };
}

// Extract highlights from description
function extractHighlights(description: string): string[] {
  const defaultHighlights = [
    "Suivi quotidien à distance",
    "Artisans qualifiés",
    "Respect des délais",
    "Finitions soignées"
  ];
  
  // Try to extract bullet points or key phrases
  const lines = description.split('\n').filter(l => l.trim());
  const bullets = lines.filter(l => l.startsWith('-') || l.startsWith('•'));
  
  if (bullets.length >= 3) {
    return bullets.slice(0, 5).map(b => b.replace(/^[-•]\s*/, ''));
  }
  
  return defaultHighlights;
}

// Extract services based on category
function extractServices(category: string): string[] {
  const servicesByCategory: Record<string, string[]> = {
    "Salle de bain": ["Plomberie", "Carrelage", "Électricité", "Peinture", "Menuiserie"],
    "Cuisine": ["Plomberie", "Électricité", "Menuiserie", "Carrelage", "Peinture"],
    "Rénovation complète": ["Maçonnerie", "Plomberie", "Électricité", "Peinture", "Parquet", "Menuiserie"],
    "Rénovation": ["Plomberie", "Électricité", "Peinture", "Menuiserie", "Finitions"],
  };
  
  return servicesByCategory[category] || servicesByCategory["Rénovation"];
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [categories, setCategories] = useState<string[]>(staticCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromDB, setIsFromDB] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Fetch projects from DB
        const { data: dbProjects, error: projectsError } = await supabase
          .from('houzz_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;

        if (!dbProjects || dbProjects.length === 0) {
          // No projects in DB, use static data
          console.log('No projects in DB, using static data');
          setIsLoading(false);
          return;
        }

        // Fetch all images
        const { data: dbImages, error: imagesError } = await supabase
          .from('houzz_project_images')
          .select('*')
          .order('image_order');

        if (imagesError) throw imagesError;

        // Group images by project
        const imagesByProject: Record<string, DBProjectImage[]> = {};
        (dbImages || []).forEach(img => {
          if (!imagesByProject[img.project_id]) {
            imagesByProject[img.project_id] = [];
          }
          imagesByProject[img.project_id].push(img);
        });

        // Convert to app format
        const appProjects = dbProjects.map(project => 
          dbToAppProject(project, imagesByProject[project.id] || [])
        );

        // Extract unique categories
        const uniqueCategories = ["Tous", ...new Set(appProjects.map(p => p.category))];

        setProjects(appProjects);
        setCategories(uniqueCategories);
        setIsFromDB(true);
        console.log(`Loaded ${appProjects.length} projects from database`);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        // Keep static projects as fallback
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, categories, isLoading, error, isFromDB };
}

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromDB, setIsFromDB] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        // First try to fetch from DB
        const { data: dbProject, error: projectError } = await supabase
          .from('houzz_projects')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (projectError) throw projectError;

        if (dbProject) {
          // Fetch images for this project
          const { data: dbImages, error: imagesError } = await supabase
            .from('houzz_project_images')
            .select('*')
            .eq('project_id', dbProject.id)
            .order('image_order');

          if (imagesError) throw imagesError;

          const appProject = dbToAppProject(dbProject, dbImages || []);
          setProject(appProject);
          setIsFromDB(true);

          // Fetch related projects (same category)
          const { data: relatedDb } = await supabase
            .from('houzz_projects')
            .select('*')
            .eq('category', dbProject.category)
            .neq('slug', slug)
            .limit(3);

          if (relatedDb) {
            // Fetch images for related projects
            const relatedIds = relatedDb.map(p => p.id);
            const { data: relatedImages } = await supabase
              .from('houzz_project_images')
              .select('*')
              .in('project_id', relatedIds);

            const imagesByProject: Record<string, DBProjectImage[]> = {};
            (relatedImages || []).forEach(img => {
              if (!imagesByProject[img.project_id]) {
                imagesByProject[img.project_id] = [];
              }
              imagesByProject[img.project_id].push(img);
            });

            const relatedAppProjects = relatedDb.map(p => 
              dbToAppProject(p, imagesByProject[p.id] || [])
            );
            setRelatedProjects(relatedAppProjects);
          }
        } else {
          // Fallback to static data
          const staticProject = staticProjects.find(p => p.slug === slug);
          if (staticProject) {
            setProject(staticProject);
            const related = staticProjects
              .filter(p => p.category === staticProject.category && p.slug !== slug)
              .slice(0, 3);
            setRelatedProjects(related);
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
        
        // Fallback to static data
        const staticProject = staticProjects.find(p => p.slug === slug);
        if (staticProject) {
          setProject(staticProject);
          const related = staticProjects
            .filter(p => p.category === staticProject.category && p.slug !== slug)
            .slice(0, 3);
          setRelatedProjects(related);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  return { project, relatedProjects, isLoading, error, isFromDB };
}
