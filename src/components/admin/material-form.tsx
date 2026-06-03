"use client";

import { useState } from "react";

import { saveMaterialAction } from "@/app/(app)/admin/actions";
import {
  checkboxClassName,
  FieldLabel,
  inputClassName,
} from "@/components/admin/admin-ui";
import { MarkdownContent } from "@/components/learning/markdown-content";
import {
  learningDifficulties,
  learningLanguages,
  type AdminMaterialRow,
  type AdminSelectOptions,
} from "@/lib/admin/learning-content-shared";

export function MaterialForm({
  material,
  options,
  returnTo,
}: {
  material?: AdminMaterialRow | null;
  options: AdminSelectOptions;
  returnTo: string;
}) {
  const [content, setContent] = useState(material?.content_md ?? "");

  return (
    <form action={saveMaterialAction} className="grid gap-5">
      <input type="hidden" name="returnTo" value={returnTo} />
      {material ? <input type="hidden" name="id" value={material.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel htmlFor="title">Titulo</FieldLabel>
          <input
            id="title"
            name="title"
            required
            minLength={3}
            maxLength={160}
            defaultValue={material?.title ?? ""}
            className={inputClassName}
          />
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <input
            id="slug"
            name="slug"
            required
            minLength={3}
            maxLength={160}
            defaultValue={material?.slug ?? ""}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="grid gap-2 lg:col-span-2">
          <FieldLabel htmlFor="category_id">Categoria</FieldLabel>
          <select
            id="category_id"
            name="category_id"
            defaultValue={material?.category_id ?? ""}
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
        <div className="grid gap-2">
          <FieldLabel htmlFor="language">Idioma</FieldLabel>
          <select
            id="language"
            name="language"
            defaultValue={material?.language ?? "mixed"}
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
            defaultValue={material?.difficulty ?? "intermediate"}
            className={inputClassName}
          >
            {learningDifficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[180px_1fr_160px_160px]">
        <div className="grid gap-2">
          <FieldLabel htmlFor="estimated_time">Tempo estimado</FieldLabel>
          <input
            id="estimated_time"
            name="estimated_time"
            type="number"
            min={0}
            defaultValue={material?.estimated_time ?? 10}
            className={inputClassName}
          />
        </div>
        <div className="grid gap-2">
          <FieldLabel htmlFor="source_reference">Source reference</FieldLabel>
          <input
            id="source_reference"
            name="source_reference"
            maxLength={300}
            defaultValue={material?.source_reference ?? "Autoral PGM Academy - Admin"}
            className={inputClassName}
          />
        </div>
        <label className={checkboxClassName}>
          <input
            name="is_premium"
            type="checkbox"
            defaultChecked={material?.is_premium ?? true}
          />
          Premium
        </label>
        <label className={checkboxClassName}>
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={material?.is_active ?? true}
          />
          Ativo
        </label>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel htmlFor="content_md">Conteúdo Markdown</FieldLabel>
          <textarea
            id="content_md"
            name="content_md"
            required
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-[420px] w-full resize-y rounded-md border border-border-soft bg-background px-3 py-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow"
          />
        </div>
        <div className="rounded-md border border-border-soft bg-background p-4">
          <p className="text-sm font-semibold text-white">Preview</p>
          <div className="mt-4 max-h-[420px] overflow-auto">
            {content ? (
              <MarkdownContent content={content} />
            ) : (
              <p className="text-sm leading-6 text-muted">
                O preview aparece conforme você escreve.
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
      >
        Salvar material
      </button>
    </form>
  );
}
