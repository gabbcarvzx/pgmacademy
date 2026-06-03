import { savePsychosocialAction } from "@/app/(app)/admin/actions";
import {
  checkboxClassName,
  FieldLabel,
  inputClassName,
  textAreaClassName,
} from "@/components/admin/admin-ui";
import type { AdminPsychosocialRow } from "@/lib/admin/learning-content";

export function PsychosocialForm({
  item,
  returnTo,
}: {
  item?: AdminPsychosocialRow | null;
  returnTo: string;
}) {
  return (
    <form action={savePsychosocialAction} className="grid gap-5">
      <input type="hidden" name="returnTo" value={returnTo} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="grid gap-2">
          <FieldLabel htmlFor="category">Categoria</FieldLabel>
          <input
            id="category"
            name="category"
            required
            maxLength={120}
            defaultValue={item?.category ?? ""}
            className={inputClassName}
          />
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="source_reference">Source reference</FieldLabel>
          <input
            id="source_reference"
            name="source_reference"
            maxLength={300}
            defaultValue={item?.source_reference ?? "Autoral PGM Academy - Admin"}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <FieldLabel htmlFor="question">Pergunta</FieldLabel>
        <textarea
          id="question"
          name="question"
          required
          defaultValue={item?.question ?? ""}
          className={textAreaClassName}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel htmlFor="ideal_answer_guidelines">
            Orientação de resposta ideal
          </FieldLabel>
          <textarea
            id="ideal_answer_guidelines"
            name="ideal_answer_guidelines"
            defaultValue={item?.ideal_answer_guidelines ?? ""}
            className={textAreaClassName}
          />
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="common_mistakes">Erros comuns</FieldLabel>
          <textarea
            id="common_mistakes"
            name="common_mistakes"
            defaultValue={item?.common_mistakes ?? ""}
            className={textAreaClassName}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={checkboxClassName}>
          <input
            name="is_premium"
            type="checkbox"
            defaultChecked={item?.is_premium ?? true}
          />
          Premium
        </label>
        <label className={checkboxClassName}>
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={item?.is_active ?? true}
          />
          Ativa
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
      >
        Salvar pergunta
      </button>
    </form>
  );
}
