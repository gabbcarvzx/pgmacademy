"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  markLearningItemsCompleted,
  type LearningItemType,
} from "@/lib/learning/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

async function requireUserId() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

export async function completeStudyMaterialAction(formData: FormData) {
  const userId = await requireUserId();
  const materialId = String(formData.get("materialId") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (!materialId) {
    throw new Error("Material invalido.");
  }

  await markLearningItemsCompleted(userId, [
    {
      itemType: "study_material",
      itemId: materialId,
      pathId: null,
    },
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/estudos");
  if (slug) {
    revalidatePath(`/estudos/${slug}`);
  }
}

export async function completePathGroupAction(formData: FormData) {
  const userId = await requireUserId();
  const pathId = String(formData.get("pathId") ?? "");
  const pathSlug = String(formData.get("pathSlug") ?? "");
  const itemType = String(formData.get("itemType") ?? "") as LearningItemType;
  const itemIds = String(formData.get("itemIds") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!pathId || !pathSlug || itemIds.length === 0) {
    throw new Error("Grupo de trilha invalido.");
  }

  await markLearningItemsCompleted(
    userId,
    itemIds.map((itemId) => ({
      itemType,
      itemId,
      pathId,
    })),
  );

  revalidatePath("/dashboard");
  revalidatePath("/trilhas");
  revalidatePath(`/trilhas/${pathSlug}`);
}

export async function reviewFlashcardAction(input: {
  categorySlug?: string | null;
  flashcardId: string;
}) {
  const userId = await requireUserId();

  await markLearningItemsCompleted(userId, [
    {
      itemType: "flashcard",
      itemId: input.flashcardId,
      pathId: null,
    },
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/flashcards");
  if (input.categorySlug) {
    revalidatePath(`/flashcards?categoria=${input.categorySlug}`);
  }
}
