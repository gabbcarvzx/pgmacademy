import {
  academyBlueprintMatchesCurrentModules,
  academyModuleBlueprints,
  objectiveSimulationBlueprint,
} from "./blueprints";
import {
  editorialCategories,
  editorialCompetencies,
  editorialDifficultyLevels,
} from "./taxonomy";

export function validateEditorialInfrastructure() {
  const errors: string[] = [];
  const categorySlugs = new Set(editorialCategories.map((category) => category.slug));

  if (editorialCategories.length !== 6) {
    errors.push("A matriz editorial deve conter 6 categorias principais.");
  }

  for (const category of editorialCategories) {
    const subcategorySlugs = new Set(
      category.subcategories.map((subcategory) => subcategory.slug),
    );

    if (subcategorySlugs.size !== category.subcategories.length) {
      errors.push(`Categoria ${category.slug} possui subcategorias duplicadas.`);
    }

    if (category.subcategories.length === 0) {
      errors.push(`Categoria ${category.slug} precisa de subcategorias.`);
    }
  }

  for (const competency of editorialCompetencies) {
    const category = editorialCategories.find(
      (item) => item.slug === competency.categorySlug,
    );

    if (!category) {
      errors.push(`Competência ${competency.code} aponta para categoria inexistente.`);
      continue;
    }

    if (!categorySlugs.has(competency.categorySlug)) {
      errors.push(`Competência ${competency.code} usa categoria inválida.`);
    }

    if (
      !category.subcategories.some(
        (subcategory) => subcategory.slug === competency.subcategorySlug,
      )
    ) {
      errors.push(
        `Competência ${competency.code} aponta para subcategoria inexistente.`,
      );
    }
  }

  const competencyCodes = new Set(
    editorialCompetencies.map((competency) => competency.code),
  );

  if (competencyCodes.size !== editorialCompetencies.length) {
    errors.push("Competências editoriais possuem códigos duplicados.");
  }

  const objectiveCategoryTotal =
    objectiveSimulationBlueprint.categoryDistribution.reduce(
      (sum, item) => sum + item.questions,
      0,
    );
  const objectiveDifficultyTotal =
    objectiveSimulationBlueprint.difficultyDistribution.reduce(
      (sum, item) => sum + item.questions,
      0,
    );

  if (objectiveCategoryTotal !== objectiveSimulationBlueprint.totalQuestions) {
    errors.push("Distribuição por categoria do simulado objetivo não soma 30.");
  }

  if (objectiveDifficultyTotal !== objectiveSimulationBlueprint.totalQuestions) {
    errors.push("Distribuição por dificuldade do simulado objetivo não soma 30.");
  }

  for (const code of objectiveSimulationBlueprint.minimumCompetencyCodes) {
    if (!competencyCodes.has(code)) {
      errors.push(`Blueprint objetivo usa competência inexistente: ${code}.`);
    }
  }

  if (editorialDifficultyLevels.map((level) => level.level).join(",") !== "1,2,3,4") {
    errors.push("Níveis editoriais devem ser exatamente 1, 2, 3 e 4.");
  }

  if (academyModuleBlueprints.length !== 7) {
    errors.push("Blueprint da Academia deve conter 7 módulos.");
  }

  if (!academyBlueprintMatchesCurrentModules()) {
    errors.push("Blueprint da Academia diverge dos módulos atuais da Sprint 5.");
  }

  for (const academyBlueprint of academyModuleBlueprints) {
    for (const code of academyBlueprint.competencyCodes) {
      if (!competencyCodes.has(code)) {
        errors.push(
          `Módulo ${academyBlueprint.moduleId} usa competência inexistente: ${code}.`,
        );
      }
    }
  }

  return errors;
}
