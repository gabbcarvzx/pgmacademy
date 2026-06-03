import { saveTemplateAction } from "@/app/(app)/admin/actions";
import {
  checkboxClassName,
  FieldLabel,
  inputClassName,
  textAreaClassName,
} from "@/components/admin/admin-ui";
import {
  learningLanguages,
  templateTypes,
  type AdminTemplateRow,
} from "@/lib/admin/learning-content";

export function TemplateForm({
  template,
  returnTo,
}: {
  template?: AdminTemplateRow | null;
  returnTo: string;
}) {
  return (
    <form action={saveTemplateAction} className="grid gap-5">
      <input type="hidden" name="returnTo" value={returnTo} />
      {template ? <input type="hidden" name="id" value={template.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
        <div className="grid gap-2">
          <FieldLabel htmlFor="title">Titulo</FieldLabel>
          <input
            id="title"
            name="title"
            required
            minLength={3}
            maxLength={160}
            defaultValue={template?.title ?? ""}
            className={inputClassName}
          />
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="total_questions">Total de questoes</FieldLabel>
          <input
            id="total_questions"
            name="total_questions"
            type="number"
            min={0}
            required
            defaultValue={template?.total_questions ?? 10}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <FieldLabel htmlFor="description">Descricao</FieldLabel>
        <textarea
          id="description"
          name="description"
          defaultValue={template?.description ?? ""}
          className={textAreaClassName}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="grid gap-2">
          <FieldLabel htmlFor="type">Tipo</FieldLabel>
          <select
            id="type"
            name="type"
            defaultValue={template?.type ?? "quick"}
            className={inputClassName}
          >
            {templateTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="language">Idioma</FieldLabel>
          <select
            id="language"
            name="language"
            defaultValue={template?.language ?? "mixed"}
            className={inputClassName}
          >
            {learningLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
        <label className={checkboxClassName}>
          <input
            name="is_premium"
            type="checkbox"
            defaultChecked={template?.is_premium ?? true}
          />
          Premium
        </label>
        <label className={checkboxClassName}>
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={template?.is_active ?? true}
          />
          Ativo
        </label>
        <div className="rounded-md border border-border-soft bg-background px-3 py-2 text-xs leading-5 text-muted">
          Editar template nao altera tentativas ja realizadas.
        </div>
      </div>

      <div className="grid gap-2">
        <FieldLabel htmlFor="source_reference">Source reference</FieldLabel>
        <input
          id="source_reference"
          name="source_reference"
          maxLength={300}
          defaultValue={template?.source_reference ?? "Autoral PGM Academy - Admin"}
          className={inputClassName}
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
      >
        Salvar template
      </button>
    </form>
  );
}
