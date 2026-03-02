import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { projects as staticProjects, categories as staticCategories, Project, BeforeAfterPair } from "@/data/projects";

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

// Clean up URL-encoded characters in titles/descriptions
function cleanText(text: string): string {
  try {
    // Decode URI-encoded characters (e.g., %C2%B2 → ²)
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

// Known bad images to skip (only the Qualirenovation logo)
const BAD_IMAGE_PATTERNS = [
  'c2a344b60455efef_5281', // Qualirenovation logo
];

function isValidProjectImage(url: string): boolean {
  return !BAD_IMAGE_PATTERNS.some(pattern => url.includes(pattern));
}

// Convert DB project to app format
function dbToAppProject(dbProject: DBProject, images: DBProjectImage[]): Project {
  const sortedImages = images.sort((a, b) => (a.image_order || 0) - (b.image_order || 0));
  
  // Filter out known bad images
  const validImages = sortedImages.filter(img => isValidProjectImage(img.image_url));
  
  // Use the first valid image as main, fallback to any image if none valid
  const mainImage = validImages[0]?.image_url || 
    sortedImages[0]?.image_url || 
    "/placeholder.svg";
  
  // Gallery excludes the main image and bad images
  const gallery = sortedImages
    .filter(img => isValidProjectImage(img.image_url) && img.image_url !== mainImage)
    .map(img => img.image_url);

  // Extract before/after pairs from caption convention: "<label>|<afterOrder>"
  const beforeAfterPairs: BeforeAfterPair[] = [];
  const imageByOrder = new Map(sortedImages.map(img => [img.image_order, img]));
  
  for (const img of sortedImages) {
    if (img.caption?.includes('|')) {
      const [label, orderStr] = img.caption.split('|');
      const afterOrder = parseInt(orderStr, 10);
      const afterImg = imageByOrder.get(afterOrder);
      if (afterImg && !isNaN(afterOrder)) {
        beforeAfterPairs.push({
          beforeImage: img.image_url,
          afterImage: afterImg.image_url,
          beforeLabel: label.trim(),
          afterLabel: "Après",
        });
      }
    }
  }

  const cleanTitle = cleanText(dbProject.title);
  const cleanDescription = cleanText(dbProject.description || "Projet de rénovation réalisé par QualiRénovation.");

  return {
    id: parseInt(dbProject.id.replace(/-/g, '').substring(0, 8), 16) || Date.now(),
    slug: dbProject.slug,
    title: cleanTitle,
    category: dbProject.category || "Rénovation complète",
    tags: (dbProject as any).tags || [],
    location: dbProject.location || "Paris",
    image: mainImage,
    photoCount: dbProject.image_count || images.length,
    houzzUrl: dbProject.houzz_url || "#",
    year: dbProject.year || new Date().getFullYear().toString(),
    budget: "Sur devis",
    description: cleanDescription,
    highlights: extractHighlights(cleanDescription),
    services: extractServices(dbProject.category || "Rénovation"),
    gallery,
    beforeAfterPairs: beforeAfterPairs.length > 0 ? beforeAfterPairs : undefined,
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
        const appProjects = dbProjects
          .map(project => dbToAppProject(project, imagesByProject[project.id] || []));

        // Extract unique categories
        // Extract unique categories including tags
        const allCats = new Set<string>();
        appProjects.forEach(p => {
          allCats.add(p.category);
          if (p.tags) p.tags.forEach(t => allCats.add(t));
        });
        const uniqueCategories = ["Tous", ...allCats];

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
  const [prevProject, setPrevProject] = useState<{ slug: string; title: string } | null>(null);
  const [nextProject, setNextProject] = useState<{ slug: string; title: string } | null>(null);
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
        // Fetch all projects for prev/next navigation
        const { data: allDbProjects, error: allError } = await supabase
          .from('houzz_projects')
          .select('slug, title')
          .order('created_at', { ascending: false });

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

          // Set prev/next from all DB projects
          if (allDbProjects && !allError) {
            const currentIndex = allDbProjects.findIndex(p => p.slug === slug);
            if (currentIndex > 0) {
              const prev = allDbProjects[currentIndex - 1];
              setPrevProject({ slug: prev.slug, title: cleanText(prev.title) });
            } else {
              setPrevProject(null);
            }
            if (currentIndex < allDbProjects.length - 1) {
              const next = allDbProjects[currentIndex + 1];
              setNextProject({ slug: next.slug, title: cleanText(next.title) });
            } else {
              setNextProject(null);
            }
          }

          // Fetch related projects (same category)
          const { data: relatedDb } = await supabase
            .from('houzz_projects')
            .select('*')
            .eq('category', dbProject.category)
            .neq('slug', slug)
            .limit(3);

          if (relatedDb) {
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
            const currentIndex = staticProjects.findIndex(p => p.slug === slug);
            setPrevProject(currentIndex > 0 ? staticProjects[currentIndex - 1] : null);
            setNextProject(currentIndex < staticProjects.length - 1 ? staticProjects[currentIndex + 1] : null);
            const related = staticProjects
              .filter(p => p.category === staticProject.category && p.slug !== slug)
              .slice(0, 3);
            setRelatedProjects(related);
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
        
        const staticProject = staticProjects.find(p => p.slug === slug);
        if (staticProject) {
          setProject(staticProject);
          const currentIndex = staticProjects.findIndex(p => p.slug === slug);
          setPrevProject(currentIndex > 0 ? staticProjects[currentIndex - 1] : null);
          setNextProject(currentIndex < staticProjects.length - 1 ? staticProjects[currentIndex + 1] : null);
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

  return { project, relatedProjects, prevProject, nextProject, isLoading, error, isFromDB };
}
