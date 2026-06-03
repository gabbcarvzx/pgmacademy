import {
  formatContentSummary,
  loadApprovedContent,
  validateApprovedContent,
} from "./content/approved-content";

const content = loadApprovedContent();
const errors = validateApprovedContent(content);

if (errors.length > 0) {
  console.error("Falha na validação do conteúdo aprovado:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Conteúdo aprovado validado com sucesso.");
console.log(formatContentSummary(content));
