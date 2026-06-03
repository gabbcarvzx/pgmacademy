import { savePathAction } from "@/app/(app)/admin/actions";
import {
  checkboxClassName,
  FieldLabel,
  inputClassName,
  textAreaClassName,
} from "@/components/admin/admin-ui";
import {
  learningLanguages,
  type AdminPathRow,
} from "@/lib/admin/learning-content";

export function PathForm({
  path,
  returnTo,
}: {
  path?: AdminPathRow | null;
  returnTo: string;
}) {
  return (
    <form action={savePathAction} className="grid gap-5">
      <input type="hidden" name="returnTo" value={returnTo} />
      {path ? <input type="hidden" name="id" value={path.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel htmlFor="title">Titulo</FieldLabel>
          <input
            id="title"
            name="title"
            required
            minLength={3}
            maxLength={160}
            defaultValue={path?.title ?? ""}
            className={inputClassName}
          />
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <input
            id="slug"
            name="slug"
            minLength={3}
            maxLength={160}
            defaultValue={path?.slug ?? ""}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <FieldLabel htmlFor="description">Descricao</FieldLabel>
        <textarea
          id="description"
          name="description"
          defaultValue={path?.description ?? ""}
          className={textAreaClassName}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[180px_1fr_160px_160px]">
        <div className="grid gap-2">
          <FieldLabel htmlFor="language">Idioma</FieldLabel>
          <select
            id="language"
            name="language"
            defaultValue={path?.language ?? "mixed"}
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
          <FieldLabel htmlFor="source_reference">Source reference</FieldLabel>
          <input
            id="source_reference"
            name="source_reference"
            maxLength={300}
            defaultValue={path?.source_reference ?? "Autoral PGM Academy - Admin"}
            className={inputClassName}
          />
        </div>
        <label className={checkboxClassName}>
          <input
            name="is_premium"
            type="checkbox"
            defaultChecked={path?.is_premium ?? true}
          />
          Premium
        </label>
        <label className={checkboxClassName}>
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={path?.is_active ?? true}
          />
          Ativo
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
      >
        Salvar trilha
      </button>
    </form>
  );
}
