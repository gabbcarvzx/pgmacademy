import type { Difficulty, Language, MaterialSeed } from "./approved-content";
import {
  DEEP_MATERIALS_SOURCE_REFERENCE,
} from "./deep-materials-constants";
import { loadDeepMaterials } from "./deep-materials-sprint-6f1";
import { loadDeepMaterialsSprint6F2 } from "./deep-materials-sprint-6f2";
import { loadDeepMaterialsSprint6F3 } from "./deep-materials-sprint-6f3";
import { loadDeepMaterialsSprint6F4 } from "./deep-materials-sprint-6f4";
import { loadDeepMaterialsSprint6F5 } from "./deep-materials-sprint-6f5";

type ImportableDeepMaterial = {
  editorialId: string;
  title: string;
  slug: string;
  subcategory: string;
  language: Language;
  difficulty: Difficulty;
  estimatedTime: number;
  isPremium: boolean;
  contentMd: string;
};

export function loadDeepMaterialSeeds(): MaterialSeed[] {
  const materials: ImportableDeepMaterial[] = [
    ...loadDeepMaterials(),
    ...loadDeepMaterialsSprint6F2(),
    ...loadDeepMaterialsSprint6F3(),
    ...loadDeepMaterialsSprint6F4(),
    ...loadDeepMaterialsSprint6F5(),
  ];

  return materials.map((material) => ({
    editorialId: material.editorialId,
    title: material.title,
    slug: material.slug,
    categorySlug: material.subcategory,
    language: material.language,
    difficulty: material.difficulty,
    estimatedTime: material.estimatedTime,
    isPremium: material.isPremium,
    contentMd: material.contentMd,
    sourceReference: DEEP_MATERIALS_SOURCE_REFERENCE,
  }));
}

export { DEEP_MATERIALS_SOURCE_REFERENCE };
