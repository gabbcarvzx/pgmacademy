import {
  formatContentSummary,
  loadApprovedContent,
  validateApprovedContent,
} from "./content/approved-content";

const content = loadApprovedContent();
const errors = validateApprovedContent(content);

if (errors.length > 0) {
  console.error("Falha na validacao do conteudo aprovado:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Conteudo aprovado validado com sucesso.");
console.log(formatContentSummary(content));
