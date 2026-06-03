import { saveQuestionAction } from "@/app/(app)/admin/actions";
import {
  checkboxClassName,
  FieldLabel,
  inputClassName,
  textAreaClassName,
} from "@/components/admin/admin-ui";
import {
  learningDifficulties,
  learningLanguages,
  type AdminQuestionOptionRow,
  type AdminQuestionRow,
  type AdminSelectOptions,
  type QuestionType,
} from "@/lib/admin/learning-content";

const optionLabels = ["A", "B", "C", "D", "E"] as const;

function parseSubjectiveExplanation(explanation: string | null) {
  const lines = (explanation ?? "").split(/\r?\n/);
  const competencies = lines
    .find((line) => line.startsWith("Competencias avaliadas:"))
    ?.replace("Competencias avaliadas:", "")
    .trim();
  const rubric = lines
    .find((line) => line.startsWith("Rubrica resumida:"))
    ?.replace("Rubrica resumida:", "")
    .trim();
  const remaining = lines
    .filter(
      (line) =>
        !line.startsWith("Competencias avaliadas:") &&
        !line.startsWith("Rubrica resumida:"),
    )
    .join("\n")
    .trim();

  return {
    competencies: competencies ?? "",
    rubric: rubric ?? "",
    explanation: remaining,
  };
}

export function QuestionForm({
  question,
  questionOptions = [],
  options,
  returnTo,
  type,
}: {
  question?: AdminQuestionRow | null;
  questionOptions?: AdminQuestionOptionRow[];
  options: AdminSelectOptions;
  returnTo: string;
  type: QuestionType;
}) {
  const subjective = parseSubjectiveExplanation(question?.explanation ?? null);
  const optionByLabel = new Map(
    questionOptions.map((option) => [option.option_label, option]),
  );

  return (
    <form action={saveQuestionAction} className="grid gap-5">
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="type" value={type} />
      {question ? <input type="hidden" name="id" value={question.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel htmlFor="bank_id">Banco</FieldLabel>
          <select
            id="bank_id"
            name="bank_id"
            required
            defaultValue={question?.bank_id ?? options.banks[0]?.id ?? ""}
            className={inputClassName}
          >
            {options.banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.language} / {bank.title}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="category_id">Categoria</FieldLabel>
          <select
            id="category_id"
            name="category_id"
            defaultValue={question?.category_id ?? ""}
            className={inputClassName}
          >
            <option value="">Sem categoria</option>
            {options.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.language} / {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="grid gap-2">
          <FieldLabel htmlFor="language">Idioma</FieldLabel>
          <select
            id="language"
            name="language"
            defaultValue={question?.language ?? "mixed"}
            className={inputClassName}
          >
            {learningLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="difficulty">Dificuldade</FieldLabel>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={question?.difficulty ?? "intermediate"}
            className={inputClassName}
          >
            {learningDifficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
        <label className={checkboxClassName}>
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={question?.is_active ?? true}
          />
          Ativa
        </label>
        <div className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
          Tipo: {type}
        </div>
      </div>

      <div className="grid gap-2">
        <FieldLabel htmlFor="statement">
          {type === "subjective" ? "Prompt" : "Enunciado"}
        </FieldLabel>
        <textarea
          id="statement"
          name="statement"
          required
          defaultValue={question?.statement ?? ""}
          className="min-h-44 w-full resize-y rounded-md border border-border-soft bg-background px-3 py-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow"
        />
      </div>

      {type === "objective" ? (
        <div className="rounded-md border border-border-soft bg-background p-4">
          <p className="text-sm font-semibold text-white">
            Alternativas A-E
          </p>
          <p className="mt-1 text-xs text-muted">
            Obrigatorio: 5 alternativas e exatamente 1 correta.
          </p>
          <div className="mt-4 grid gap-3">
            {optionLabels.map((label) => {
              const option = optionByLabel.get(label);
              return (
                <div key={label} className="grid gap-3 lg:grid-cols-[52px_1fr_120px]">
                  <span className="flex h-11 items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-white">
                    {label}
                  </span>
                  <input
                    name={`option_${label}`}
                    required
                    defaultValue={option?.option_text ?? ""}
                    className={inputClassName}
                  />
                  <label className={checkboxClassName}>
                    <input
                      name="correct_option"
                      type="radio"
                      value={label}
                      required
                      defaultChecked={option?.is_correct ?? label === "A"}
                    />
                    Correta
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel htmlFor="competencies">Competencias avaliadas</FieldLabel>
            <textarea
              id="competencies"
              name="competencies"
              defaultValue={subjective.competencies}
              className={textAreaClassName}
            />
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="rubric">Rubrica</FieldLabel>
            <textarea
              id="rubric"
              name="rubric"
              defaultValue={subjective.rubric}
              className={textAreaClassName}
            />
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <FieldLabel htmlFor="explanation">
          {type === "objective" ? "Explicacao" : "Observacoes adicionais"}
        </FieldLabel>
        <textarea
          id="explanation"
          name="explanation"
          defaultValue={
            type === "subjective"
              ? subjective.explanation
              : question?.explanation ?? ""
          }
          className={textAreaClassName}
        />
      </div>

      <div className="grid gap-2">
        <FieldLabel htmlFor="source_reference">Source reference</FieldLabel>
        <input
          id="source_reference"
          name="source_reference"
          maxLength={300}
          defaultValue={question?.source_reference ?? "Autoral PGM Academy - Admin"}
          className={inputClassName}
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
      >
        Salvar questao
      </button>
    </form>
  );
}
