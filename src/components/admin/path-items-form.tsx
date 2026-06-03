import { updatePathItemsAction } from "@/app/(app)/admin/actions";
import {
  AdminBadge,
  checkboxClassName,
  FieldLabel,
  inputClassName,
} from "@/components/admin/admin-ui";
import type {
  AdminPathItemRow,
  AdminSelectOptions,
  PathItemType,
} from "@/lib/admin/learning-content";

const pathItemLabels: Record<PathItemType, string> = {
  study_material: "Material",
  flashcard: "Flashcard",
  question: "Questão",
  psychosocial_question: "Psicossocial",
  simulation_template: "Simulado",
};

function buildOptionGroups(options: AdminSelectOptions) {
  return [
    {
      label: "Materiais",
      items: options.materials.map((item) => ({
        value: `study_material:${item.id}`,
        label: item.title,
      })),
    },
    {
      label: "Flashcards",
      items: options.flashcards.map((item) => ({
        value: `flashcard:${item.id}`,
        label: item.title,
      })),
    },
    {
      label: "Questões",
      items: options.questions.map((item) => ({
        value: `question:${item.id}`,
        label: `${item.type} / ${item.title}`,
      })),
    },
    {
      label: "Perguntas psicossociais",
      items: options.psychosocialQuestions.map((item) => ({
        value: `psychosocial_question:${item.id}`,
        label: item.title,
      })),
    },
    {
      label: "Templates de simulado",
      items: options.templates.map((item) => ({
        value: `simulation_template:${item.id}`,
        label: item.title,
      })),
    },
  ];
}

function labelForItem(item: AdminPathItemRow, options: AdminSelectOptions) {
  if (item.item_type === "study_material") {
    return options.materials.find((material) => material.id === item.item_id)?.title;
  }
  if (item.item_type === "flashcard") {
    return options.flashcards.find((card) => card.id === item.item_id)?.title;
  }
  if (item.item_type === "question") {
    const question = options.questions.find((entry) => entry.id === item.item_id);
    return question ? `${question.type} / ${question.title}` : null;
  }
  if (item.item_type === "psychosocial_question") {
    return options.psychosocialQuestions.find((entry) => entry.id === item.item_id)
      ?.title;
  }

  return options.templates.find((template) => template.id === item.item_id)?.title;
}

export function PathItemsForm({
  pathId,
  items,
  options,
}: {
  pathId: string;
  items: AdminPathItemRow[];
  options: AdminSelectOptions;
}) {
  const optionGroups = buildOptionGroups(options);
  const nextSortOrder =
    items.reduce((max, item) => Math.max(max, item.sort_order), 0) + 1;

  return (
    <form action={updatePathItemsAction} className="grid gap-5">
      <input type="hidden" name="returnTo" value={`/admin/paths/${pathId}/edit`} />
      <input type="hidden" name="path_id" value={pathId} />

      <div className="grid gap-3">
        {items.length === 0 ? (
          <p className="rounded-md border border-border-soft bg-background p-4 text-sm text-muted">
            Nenhum item adicionado ainda.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-md border border-border-soft bg-background p-4 lg:grid-cols-[100px_160px_1fr_160px]"
            >
              <input type="hidden" name="path_item_id" value={item.id} />
              <div className="grid gap-2">
                <FieldLabel htmlFor={`sort_${item.id}`}>Ordem</FieldLabel>
                <input
                  id={`sort_${item.id}`}
                  name={`sort_${item.id}`}
                  type="number"
                  min={0}
                  defaultValue={item.sort_order}
                  className={inputClassName}
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted">
                  Tipo
                </p>
                <div className="mt-2">
                  <AdminBadge tone="yellow">
                    {pathItemLabels[item.item_type]}
                  </AdminBadge>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted">
                  Item
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {labelForItem(item, options) ?? item.item_id}
                </p>
              </div>
              <label className={checkboxClassName}>
                <input name={`remove_${item.id}`} type="checkbox" />
                Remover
              </label>
            </div>
          ))
        )}
      </div>

      <div className="rounded-md border border-border-soft bg-background p-4">
        <p className="text-sm font-semibold text-white">Adicionar item</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_140px]">
          <div className="grid gap-2">
            <FieldLabel htmlFor="new_item">Item</FieldLabel>
            <select id="new_item" name="new_item" className={inputClassName}>
              <option value="">Não adicionar agora</option>
              {optionGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.items.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <FieldLabel htmlFor="new_sort_order">Ordem</FieldLabel>
            <input
              id="new_sort_order"
              name="new_sort_order"
              type="number"
              min={0}
              defaultValue={nextSortOrder}
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
      >
        Atualizar sequência
      </button>
    </form>
  );
}
