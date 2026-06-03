import { saveFlashcardAction } from "@/app/(app)/admin/actions";
import {
  checkboxClassName,
  FieldLabel,
  inputClassName,
  textAreaClassName,
} from "@/components/admin/admin-ui";
import {
  learningDifficulties,
  learningLanguages,
  type AdminFlashcardRow,
  type AdminSelectOptions,
} from "@/lib/admin/learning-content";

export function FlashcardForm({
  flashcard,
  options,
  returnTo,
}: {
  flashcard?: AdminFlashcardRow | null;
  options: AdminSelectOptions;
  returnTo: string;
}) {
  return (
    <form action={saveFlashcardAction} className="grid gap-5">
      <input type="hidden" name="returnTo" value={returnTo} />
      {flashcard ? <input type="hidden" name="id" value={flashcard.id} /> : null}

      <div className="grid gap-2">
        <FieldLabel htmlFor="category_id">Categoria</FieldLabel>
        <select
          id="category_id"
          name="category_id"
          defaultValue={flashcard?.category_id ?? ""}
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

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel htmlFor="front_content">Frente</FieldLabel>
          <textarea
            id="front_content"
            name="front_content"
            required
            defaultValue={flashcard?.front_content ?? ""}
            className={textAreaClassName}
          />
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="back_content">Verso</FieldLabel>
          <textarea
            id="back_content"
            name="back_content"
            required
            defaultValue={flashcard?.back_content ?? ""}
            className={textAreaClassName}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="grid gap-2">
          <FieldLabel htmlFor="language">Idioma</FieldLabel>
          <select
            id="language"
            name="language"
            defaultValue={flashcard?.language ?? "mixed"}
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
            defaultValue={flashcard?.difficulty ?? "beginner"}
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
            name="is_premium"
            type="checkbox"
            defaultChecked={flashcard?.is_premium ?? true}
          />
          Premium
        </label>
        <label className={checkboxClassName}>
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={flashcard?.is_active ?? true}
          />
          Ativo
        </label>
      </div>

      <div className="grid gap-2">
        <FieldLabel htmlFor="source_reference">Source reference</FieldLabel>
        <input
          id="source_reference"
          name="source_reference"
          maxLength={300}
          defaultValue={flashcard?.source_reference ?? "Autoral PGM Academy - Admin"}
          className={inputClassName}
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
      >
        Salvar flashcard
      </button>
    </form>
  );
}
