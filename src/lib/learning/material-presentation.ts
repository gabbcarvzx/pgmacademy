const retaFinalCompetenceBySlug = {
  "verb-to-be-reta-final-pgm": "Gramática aplicada",
  "subject-pronouns-reta-final-pgm": "Gramática aplicada",
  "possessive-adjectives-reta-final-pgm": "Gramática aplicada",
  "present-simple-reta-final-pgm": "Gramática aplicada",
  "present-continuous-reta-final-pgm": "Gramática aplicada",
  "question-words-reta-final-pgm": "Gramática aplicada",
  "articles-a-an-the-reta-final-pgm": "Gramática aplicada",
  "prepositions-reta-final-pgm": "Gramática aplicada",
  "adverbs-of-frequency-reta-final-pgm": "Gramática aplicada",
  "comparatives-superlatives-reta-final-pgm": "Gramática aplicada",
  "present-perfect-reta-final-pgm": "Gramática aplicada",
  "reading-strategies-for-pgm": "Compreensão leitora",
  "spanish-ser-vs-estar-pgm": "Gramática aplicada",
  "spanish-pronombres-personales-pgm": "Gramática aplicada",
  "spanish-articulos-pgm": "Gramática aplicada",
  "spanish-verbos-basicos-pgm": "Gramática aplicada",
  "spanish-comparativos-pgm": "Gramática aplicada",
  "spanish-falsos-cognatos-pgm": "Vocabulário contextual",
  "spanish-comprension-lectora-pgm": "Compreensão leitora",
} as const;

export function getMaterialPresentation(slug: string, categoryName: string) {
  const competence =
    retaFinalCompetenceBySlug[slug as keyof typeof retaFinalCompetenceBySlug];

  return {
    competence: competence ?? categoryName,
    isRetaFinal: Boolean(competence),
  };
}
