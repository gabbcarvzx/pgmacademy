import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type AccessStatus = Database["public"]["Tables"]["profiles"]["Row"]["access_status"];
type LearningLanguage =
  Database["public"]["Tables"]["study_materials"]["Row"]["language"];
type LearningDifficulty =
  Database["public"]["Tables"]["study_materials"]["Row"]["difficulty"];
export type LearningItemType =
  Database["public"]["Tables"]["user_learning_progress"]["Row"]["item_type"];

type ProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "tenant_id" | "access_status" | "role"
>;
type CategoryRow = Pick<
  Database["public"]["Tables"]["question_categories"]["Row"],
  "id" | "name" | "slug" | "language"
>;
type StudyMaterialRow = Pick<
  Database["public"]["Tables"]["study_materials"]["Row"],
  | "id"
  | "tenant_id"
  | "category_id"
  | "title"
  | "slug"
  | "difficulty"
  | "language"
  | "estimated_time"
  | "is_premium"
  | "is_active"
> & {
  content_md?: string;
};
type FlashcardRow = Pick<
  Database["public"]["Tables"]["flashcards"]["Row"],
  | "id"
  | "tenant_id"
  | "category_id"
  | "front_content"
  | "back_content"
  | "language"
  | "difficulty"
  | "is_premium"
  | "is_active"
>;
type LearningPathRow = Pick<
  Database["public"]["Tables"]["learning_paths"]["Row"],
  | "id"
  | "tenant_id"
  | "title"
  | "description"
  | "slug"
  | "language"
  | "is_premium"
  | "is_active"
>;
type LearningPathItemRow = Pick<
  Database["public"]["Tables"]["learning_path_items"]["Row"],
  "id" | "path_id" | "item_type" | "item_id" | "sort_order"
>;
type ProgressRow = Pick<
  Database["public"]["Tables"]["user_learning_progress"]["Row"],
  "id" | "path_id" | "item_type" | "item_id" | "completed" | "completed_at"
>;
type QuestionRow = Pick<
  Database["public"]["Tables"]["questions"]["Row"],
  "id" | "editorial_id" | "statement" | "type" | "difficulty" | "language"
>;
type PsychosocialQuestionRow = Pick<
  Database["public"]["Tables"]["psychosocial_questions"]["Row"],
  "id" | "editorial_id" | "category" | "question"
>;

export type MaterialCard = {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  language: LearningLanguage;
  difficulty: LearningDifficulty;
  estimatedTime: number;
  isPremium: boolean;
  canAccess: boolean;
};

export type MaterialFilters = {
  search?: string;
  language?: string;
  category?: string;
  difficulty?: string;
  page?: string;
};

export type MaterialDetail = MaterialCard & {
  contentMd: string | null;
  relatedMaterials: MaterialCard[];
  relatedPaths: Array<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    canAccess: boolean;
  }>;
  isCompleted: boolean;
};

export type StudyMaterialsPageData = {
  accessStatus: AccessStatus;
  hasPaidAccess: boolean;
  materials: MaterialCard[];
  filters: {
    search: string;
    language: string;
    category: string;
    difficulty: string;
    page: number;
  };
  filterOptions: {
    categories: Array<{ name: string; slug: string }>;
    languages: LearningLanguage[];
    difficulties: LearningDifficulty[];
  };
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export type LearningPathCard = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  language: LearningLanguage;
  isPremium: boolean;
  canAccess: boolean;
  itemCount: number;
  completedItemCount: number;
  progressPercent: number;
};

export type LearningPathGroup = {
  groupId: string;
  itemType: LearningItemType;
  itemIds: string[];
  title: string;
  description: string;
  href: string | null;
  totalItems: number;
  completedItems: number;
};

export type LearningPathDetail = LearningPathCard & {
  groups: LearningPathGroup[];
};

export type FlashcardDeckSummary = {
  categorySlug: string;
  categoryName: string;
  language: LearningLanguage;
  totalCards: number;
  reviewedCards: number;
  canAccess: boolean;
};

export type FlashcardItem = {
  id: string;
  frontContent: string;
  backContent: string;
  isReviewed: boolean;
};

export type FlashcardsPageData = {
  accessStatus: AccessStatus;
  hasPaidAccess: boolean;
  decks: FlashcardDeckSummary[];
  selectedCategorySlug: string | null;
  selectedDeck: FlashcardDeckSummary | null;
  cards: FlashcardItem[];
};

export type LearningDashboardStats = {
  completedMaterials: number;
  startedPaths: number;
  completedPaths: number;
  reviewedFlashcards: number;
};

const languageOrder: LearningLanguage[] = [
  "english",
  "spanish",
  "portuguese",
  "mixed",
  "psychosocial",
];
const difficultyOrder: LearningDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
  "mixed",
];

function hasPaidAccess(profile: Pick<ProfileRow, "access_status">) {
  return profile.access_status === "paid";
}

function isTenantVisible(tenantId: string | null, profile: ProfileRow) {
  return tenantId === null || tenantId === profile.tenant_id;
}

function canAccessPremiumItem(isPremium: boolean, profile: ProfileRow) {
  return !isPremium || hasPaidAccess(profile) || profile.role === "admin";
}

function assertResult<T>(
  data: T | null,
  error: { message: string } | null,
  message: string,
): T {
  if (error || !data) {
    throw new Error(`${message}${error ? ` ${error.message}` : ""}`);
  }

  return data;
}

async function getProfile(userId: string): Promise<ProfileRow> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, tenant_id, access_status, role")
    .eq("id", userId)
    .single();

  return assertResult(data as ProfileRow | null, error, "Perfil do aluno nao encontrado.");
}

async function getCategories(): Promise<CategoryRow[]> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("question_categories")
    .select("id, name, slug, language")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Nao foi possivel consultar categorias.");
  }

  return (data ?? []) as CategoryRow[];
}

async function getProgressRows(userId: string, profile: ProfileRow): Promise<ProgressRow[]> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("user_learning_progress")
    .select("id, path_id, item_type, item_id, completed, completed_at")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .eq("completed", true);

  if (error) {
    throw new Error("Nao foi possivel consultar progresso do aluno.");
  }

  return (data ?? []) as ProgressRow[];
}

function progressKey(itemType: LearningItemType, itemId: string, pathId: string | null) {
  return `${pathId ?? "global"}:${itemType}:${itemId}`;
}

function materialToCard(
  material: StudyMaterialRow,
  categoryById: Map<string, CategoryRow>,
  profile: ProfileRow,
): MaterialCard {
  const category = material.category_id ? categoryById.get(material.category_id) : null;

  return {
    id: material.id,
    title: material.title,
    slug: material.slug,
    categoryName: category?.name ?? "Sem categoria",
    categorySlug: category?.slug ?? "sem-categoria",
    language: material.language,
    difficulty: material.difficulty,
    estimatedTime: material.estimated_time,
    isPremium: material.is_premium,
    canAccess: canAccessPremiumItem(material.is_premium, profile),
  };
}

function normalizeFilters(filters: MaterialFilters) {
  return {
    search: filters.search?.trim() ?? "",
    language: filters.language?.trim() ?? "",
    category: filters.category?.trim() ?? "",
    difficulty: filters.difficulty?.trim() ?? "",
    page: Math.max(Number(filters.page ?? "1") || 1, 1),
  };
}

export async function getStudyMaterialsPage(
  userId: string,
  filters: MaterialFilters,
): Promise<StudyMaterialsPageData> {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const normalizedFilters = normalizeFilters(filters);
  const [categories, progressRows] = await Promise.all([
    getCategories(),
    getProgressRows(userId, profile),
  ]);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const searchLower = normalizedFilters.search.toLowerCase();

  const { data, error } = await admin
    .from("study_materials")
    .select(
      "id, tenant_id, category_id, title, slug, difficulty, language, estimated_time, is_premium, is_active",
    )
    .eq("is_active", true)
    .order("title", { ascending: true });

  if (error) {
    throw new Error("Nao foi possivel consultar materiais.");
  }

  const completedKeys = new Set(
    progressRows.map((row) => progressKey(row.item_type, row.item_id, row.path_id)),
  );
  const filteredMaterials = ((data ?? []) as StudyMaterialRow[])
    .filter((material) => isTenantVisible(material.tenant_id, profile))
    .filter((material) => {
      const category = material.category_id ? categoryById.get(material.category_id) : null;
      if (normalizedFilters.language && material.language !== normalizedFilters.language) return false;
      if (normalizedFilters.difficulty && material.difficulty !== normalizedFilters.difficulty) return false;
      if (normalizedFilters.category && category?.slug !== normalizedFilters.category) return false;
      if (searchLower && !material.title.toLowerCase().includes(searchLower)) return false;
      return true;
    })
    .sort((a, b) => {
      if (searchLower) {
        const aStarts = a.title.toLowerCase().startsWith(searchLower) ? 0 : 1;
        const bStarts = b.title.toLowerCase().startsWith(searchLower) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
      }

      const aCompleted = completedKeys.has(progressKey("study_material", a.id, null)) ? 1 : 0;
      const bCompleted = completedKeys.has(progressKey("study_material", b.id, null)) ? 1 : 0;
      if (aCompleted !== bCompleted) return aCompleted - bCompleted;

      return a.title.localeCompare(b.title, "pt-BR");
    });

  const pageSize = 12;
  const totalItems = filteredMaterials.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const page = Math.min(normalizedFilters.page, totalPages);
  const materials = filteredMaterials
    .slice((page - 1) * pageSize, page * pageSize)
    .map((material) => materialToCard(material, categoryById, profile));
  const materialCategorySlugs = new Set(
    ((data ?? []) as StudyMaterialRow[])
      .map((material) => (material.category_id ? categoryById.get(material.category_id)?.slug : null))
      .filter(Boolean),
  );

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPaidAccess(profile),
    materials,
    filters: {
      ...normalizedFilters,
      page,
    },
    filterOptions: {
      categories: categories
        .filter((category) => materialCategorySlugs.has(category.slug))
        .map((category) => ({ name: category.name, slug: category.slug })),
      languages: languageOrder,
      difficulties: difficultyOrder,
    },
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

export async function getStudyMaterialDetail(
  userId: string,
  slug: string,
): Promise<MaterialDetail | null> {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const [categories, progressRows] = await Promise.all([
    getCategories(),
    getProgressRows(userId, profile),
  ]);
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  const { data, error } = await admin
    .from("study_materials")
    .select(
      "id, tenant_id, category_id, title, slug, difficulty, language, estimated_time, is_premium, is_active",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error("Nao foi possivel consultar material.");
  }
  if (!data) {
    return null;
  }

  const material = data as StudyMaterialRow;
  if (!isTenantVisible(material.tenant_id, profile)) {
    return null;
  }

  const card = materialToCard(material, categoryById, profile);
  const relatedMaterials = await getRelatedMaterials(profile, categoryById, material);
  const relatedPaths = await getPathsForItem(profile, "study_material", material.id);
  const completedKeys = new Set(
    progressRows.map((row) => progressKey(row.item_type, row.item_id, row.path_id)),
  );

  return {
    ...card,
    contentMd: card.canAccess ? (material.content_md ?? null) : null,
    relatedMaterials,
    relatedPaths,
    isCompleted: completedKeys.has(progressKey("study_material", material.id, null)),
  };
}

async function getRelatedMaterials(
  profile: ProfileRow,
  categoryById: Map<string, CategoryRow>,
  material: StudyMaterialRow,
) {
  if (!material.category_id) {
    return [];
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("study_materials")
    .select(
      "id, tenant_id, category_id, title, slug, content_md, difficulty, language, estimated_time, is_premium, is_active",
    )
    .eq("category_id", material.category_id)
    .eq("is_active", true)
    .neq("id", material.id)
    .order("title", { ascending: true })
    .limit(4);

  if (error) {
    return [];
  }

  return ((data ?? []) as StudyMaterialRow[])
    .filter((item) => isTenantVisible(item.tenant_id, profile))
    .map((item) => materialToCard(item, categoryById, profile));
}

async function getPathsForItem(profile: ProfileRow, itemType: LearningItemType, itemId: string) {
  const admin = getSupabaseAdminClient();
  const { data: itemRows, error: itemError } = await admin
    .from("learning_path_items")
    .select("path_id")
    .eq("item_type", itemType)
    .eq("item_id", itemId);

  if (itemError || !itemRows?.length) {
    return [];
  }

  const pathIds = [...new Set(itemRows.map((row) => row.path_id))];
  const { data: paths, error: pathError } = await admin
    .from("learning_paths")
    .select("id, tenant_id, title, description, slug, language, is_premium, is_active")
    .in("id", pathIds)
    .eq("is_active", true);

  if (pathError) {
    return [];
  }

  return ((paths ?? []) as LearningPathRow[])
    .filter((path) => isTenantVisible(path.tenant_id, profile))
    .map((path) => ({
      id: path.id,
      title: path.title,
      slug: path.slug ?? path.id,
      description: path.description,
      canAccess: canAccessPremiumItem(path.is_premium, profile),
    }));
}

export async function getLearningPathsPage(userId: string): Promise<{
  accessStatus: AccessStatus;
  hasPaidAccess: boolean;
  paths: LearningPathCard[];
}> {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const [progressRows, pathsResponse] = await Promise.all([
    getProgressRows(userId, profile),
    admin
      .from("learning_paths")
      .select("id, tenant_id, title, description, slug, language, is_premium, is_active")
      .eq("is_active", true)
      .order("title", { ascending: true }),
  ]);

  if (pathsResponse.error) {
    throw new Error("Nao foi possivel consultar trilhas.");
  }

  const paths = ((pathsResponse.data ?? []) as LearningPathRow[]).filter((path) =>
    isTenantVisible(path.tenant_id, profile),
  );
  const pathItems = await getPathItems(paths.map((path) => path.id));

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPaidAccess(profile),
    paths: paths.map((path) => buildPathCard(path, pathItems, progressRows, profile)),
  };
}

export async function getLearningPathDetail(
  userId: string,
  slug: string,
): Promise<LearningPathDetail | null> {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const { data, error } = await admin
    .from("learning_paths")
    .select("id, tenant_id, title, description, slug, language, is_premium, is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error("Nao foi possivel consultar trilha.");
  }
  if (!data) {
    return null;
  }

  const path = data as LearningPathRow;
  if (!isTenantVisible(path.tenant_id, profile)) {
    return null;
  }

  const [items, progressRows] = await Promise.all([
    getPathItems([path.id]),
    getProgressRows(userId, profile),
  ]);
  const card = buildPathCard(path, items, progressRows, profile);

  return {
    ...card,
    groups: await buildPathGroups(card.canAccess, items, progressRows),
  };
}

async function getPathItems(pathIds: string[]): Promise<LearningPathItemRow[]> {
  if (pathIds.length === 0) {
    return [];
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("learning_path_items")
    .select("id, path_id, item_type, item_id, sort_order")
    .in("path_id", pathIds)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error("Nao foi possivel consultar itens de trilha.");
  }

  return (data ?? []) as LearningPathItemRow[];
}

function buildPathCard(
  path: LearningPathRow,
  allItems: LearningPathItemRow[],
  progressRows: ProgressRow[],
  profile: ProfileRow,
): LearningPathCard {
  const items = allItems.filter((item) => item.path_id === path.id);
  const completedKeys = new Set(
    progressRows.map((row) => progressKey(row.item_type, row.item_id, row.path_id)),
  );
  const completedItemCount = items.filter((item) =>
    completedKeys.has(progressKey(item.item_type, item.item_id, path.id)),
  ).length;
  const itemCount = items.length;

  return {
    id: path.id,
    title: path.title,
    slug: path.slug ?? path.id,
    description: path.description,
    language: path.language,
    isPremium: path.is_premium,
    canAccess: canAccessPremiumItem(path.is_premium, profile),
    itemCount,
    completedItemCount,
    progressPercent: itemCount === 0 ? 0 : Math.round((completedItemCount / itemCount) * 100),
  };
}

async function buildPathGroups(
  canAccess: boolean,
  items: LearningPathItemRow[],
  progressRows: ProgressRow[],
): Promise<LearningPathGroup[]> {
  const groups: LearningPathItemRow[][] = [];

  for (const item of items) {
    const previousGroup = groups.at(-1);
    if (previousGroup && previousGroup[0].item_type === item.item_type) {
      previousGroup.push(item);
    } else {
      groups.push([item]);
    }
  }

  const labels = canAccess ? await getItemLabels(items) : new Map<string, { title: string; href: string | null }>();
  const completedKeys = new Set(
    progressRows.map((row) => progressKey(row.item_type, row.item_id, row.path_id)),
  );

  return groups.map((group, index) => {
    const first = group[0];
    const completedItems = group.filter((item) =>
      completedKeys.has(progressKey(item.item_type, item.item_id, item.path_id)),
    ).length;
    const firstLabel = labels.get(`${first.item_type}:${first.item_id}`);

    return {
      groupId: `${first.path_id}:${index}:${first.item_type}`,
      itemType: first.item_type,
      itemIds: group.map((item) => item.item_id),
      title: canAccess
        ? group.length === 1
          ? (firstLabel?.title ?? itemTypeLabel(first.item_type))
          : `${itemTypePluralLabel(first.item_type)} (${group.length})`
        : itemTypePluralLabel(first.item_type),
      description: groupDescription(first.item_type, group.length, completedItems, canAccess),
      href: group.length === 1 ? (firstLabel?.href ?? null) : null,
      totalItems: group.length,
      completedItems,
    };
  });
}

async function getItemLabels(items: LearningPathItemRow[]) {
  const admin = getSupabaseAdminClient();
  const labels = new Map<string, { title: string; href: string | null }>();
  const byType = new Map<LearningItemType, string[]>();

  for (const item of items) {
    byType.set(item.item_type, [...(byType.get(item.item_type) ?? []), item.item_id]);
  }

  const materialIds = byType.get("study_material") ?? [];
  if (materialIds.length > 0) {
    const { data } = await admin
      .from("study_materials")
      .select("id, title, slug")
      .in("id", materialIds);
    for (const item of data ?? []) {
      labels.set(`study_material:${item.id}`, {
        title: item.title,
        href: `/estudos/${item.slug}`,
      });
    }
  }

  const flashcardIds = byType.get("flashcard") ?? [];
  if (flashcardIds.length > 0) {
    const { data } = await admin
      .from("flashcards")
      .select("id, front_content")
      .in("id", flashcardIds);
    for (const item of data ?? []) {
      labels.set(`flashcard:${item.id}`, {
        title: item.front_content,
        href: "/flashcards",
      });
    }
  }

  const questionIds = byType.get("question") ?? [];
  if (questionIds.length > 0) {
    const { data } = await admin
      .from("questions")
      .select("id, editorial_id, statement, type, difficulty, language")
      .in("id", questionIds);
    for (const item of (data ?? []) as QuestionRow[]) {
      labels.set(`question:${item.id}`, {
        title: item.editorial_id ?? item.statement.slice(0, 80),
        href: null,
      });
    }
  }

  const psychosocialIds = byType.get("psychosocial_question") ?? [];
  if (psychosocialIds.length > 0) {
    const { data } = await admin
      .from("psychosocial_questions")
      .select("id, editorial_id, category, question")
      .in("id", psychosocialIds);
    for (const item of (data ?? []) as PsychosocialQuestionRow[]) {
      labels.set(`psychosocial_question:${item.id}`, {
        title: item.question,
        href: null,
      });
    }
  }

  return labels;
}

export async function getFlashcardsPage(
  userId: string,
  categorySlug?: string,
): Promise<FlashcardsPageData> {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const [categories, progressRows] = await Promise.all([
    getCategories(),
    getProgressRows(userId, profile),
  ]);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const { data, error } = await admin
    .from("flashcards")
    .select(
      "id, tenant_id, category_id, front_content, back_content, language, difficulty, is_premium, is_active",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Nao foi possivel consultar flashcards.");
  }

  const flashcards = ((data ?? []) as FlashcardRow[]).filter((card) =>
    isTenantVisible(card.tenant_id, profile),
  );
  const completedGlobal = new Set(
    progressRows
      .filter((row) => row.item_type === "flashcard")
      .map((row) => row.item_id),
  );
  const grouped = new Map<string, FlashcardRow[]>();

  for (const card of flashcards) {
    const category = card.category_id ? categoryById.get(card.category_id) : null;
    const slug = category?.slug ?? "sem-categoria";
    grouped.set(slug, [...(grouped.get(slug) ?? []), card]);
  }

  const decks = [...grouped.entries()]
    .map(([slug, cards]) => {
      const category = cards[0].category_id ? categoryById.get(cards[0].category_id) : null;
      return {
        categorySlug: slug,
        categoryName: category?.name ?? "Sem categoria",
        language: cards[0].language,
        totalCards: cards.length,
        reviewedCards: cards.filter((card) => completedGlobal.has(card.id)).length,
        canAccess: cards.some((card) => canAccessPremiumItem(card.is_premium, profile)),
      };
    })
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName, "pt-BR"));

  const selectedCategorySlug = categorySlug && grouped.has(categorySlug)
    ? categorySlug
    : decks[0]?.categorySlug ?? null;
  const selectedDeck = decks.find((deck) => deck.categorySlug === selectedCategorySlug) ?? null;
  const selectedCards = selectedCategorySlug ? grouped.get(selectedCategorySlug) ?? [] : [];
  const canAccessDeck = selectedCards.some((card) => canAccessPremiumItem(card.is_premium, profile));

  return {
    accessStatus: profile.access_status,
    hasPaidAccess: hasPaidAccess(profile),
    decks,
    selectedCategorySlug,
    selectedDeck,
    cards: canAccessDeck
      ? selectedCards.slice(0, 40).map((card) => ({
          id: card.id,
          frontContent: card.front_content,
          backContent: card.back_content,
          isReviewed: completedGlobal.has(card.id),
        }))
      : [],
  };
}

export async function getLearningDashboardStats(userId: string): Promise<LearningDashboardStats> {
  const profile = await getProfile(userId);
  const [progressRows, pathsPage] = await Promise.all([
    getProgressRows(userId, profile),
    getLearningPathsPage(userId),
  ]);

  return {
    completedMaterials: new Set(
      progressRows
        .filter((row) => row.item_type === "study_material")
        .map((row) => row.item_id),
    ).size,
    startedPaths: new Set(
      progressRows
        .filter((row) => row.path_id)
        .map((row) => row.path_id),
    ).size,
    completedPaths: pathsPage.paths.filter(
      (path) => path.itemCount > 0 && path.completedItemCount === path.itemCount,
    ).length,
    reviewedFlashcards: new Set(
      progressRows
        .filter((row) => row.item_type === "flashcard")
        .map((row) => row.item_id),
    ).size,
  };
}

export async function markLearningItemsCompleted(
  userId: string,
  items: Array<{
    itemType: LearningItemType;
    itemId: string;
    pathId?: string | null;
  }>,
): Promise<void> {
  const profile = await getProfile(userId);

  for (const item of items) {
    await assertCanCompleteItem(profile, item);
    await upsertProgress(userId, profile, item.itemType, item.itemId, item.pathId ?? null);
  }
}

async function assertCanCompleteItem(
  profile: ProfileRow,
  item: {
    itemType: LearningItemType;
    itemId: string;
    pathId?: string | null;
  },
) {
  const admin = getSupabaseAdminClient();

  if (item.pathId) {
    const { data: path, error } = await admin
      .from("learning_paths")
      .select("id, tenant_id, is_premium, is_active")
      .eq("id", item.pathId)
      .single();

    if (error || !path || !path.is_active || !isTenantVisible(path.tenant_id, profile)) {
      throw new Error("Trilha nao encontrada para progresso.");
    }
    if (!canAccessPremiumItem(path.is_premium, profile)) {
      throw new Error("Acesso premium necessario para concluir esta trilha.");
    }
  }

  if (item.itemType === "study_material") {
    const { data, error } = await admin
      .from("study_materials")
      .select("id, tenant_id, is_premium, is_active")
      .eq("id", item.itemId)
      .single();
    if (error || !data || !data.is_active || !isTenantVisible(data.tenant_id, profile)) {
      throw new Error("Material nao encontrado para progresso.");
    }
    if (!canAccessPremiumItem(data.is_premium, profile)) {
      throw new Error("Acesso premium necessario para concluir este material.");
    }
  }

  if (item.itemType === "flashcard") {
    const { data, error } = await admin
      .from("flashcards")
      .select("id, tenant_id, is_premium, is_active")
      .eq("id", item.itemId)
      .single();
    if (error || !data || !data.is_active || !isTenantVisible(data.tenant_id, profile)) {
      throw new Error("Flashcard nao encontrado para progresso.");
    }
    if (!canAccessPremiumItem(data.is_premium, profile)) {
      throw new Error("Acesso premium necessario para revisar este flashcard.");
    }
  }
}

async function upsertProgress(
  userId: string,
  profile: ProfileRow,
  itemType: LearningItemType,
  itemId: string,
  pathId: string | null,
) {
  const admin = getSupabaseAdminClient();
  const now = new Date().toISOString();
  let query = admin
    .from("user_learning_progress")
    .select("id")
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .eq("item_type", itemType)
    .eq("item_id", itemId);

  query = pathId ? query.eq("path_id", pathId) : query.is("path_id", null);
  const { data: existing, error: existingError } = await query.maybeSingle();

  if (existingError) {
    throw new Error("Nao foi possivel consultar progresso existente.");
  }

  if (existing?.id) {
    const { error } = await admin
      .from("user_learning_progress")
      .update({ completed: true, completed_at: now })
      .eq("id", existing.id);
    if (error) throw new Error("Nao foi possivel atualizar progresso.");
    return;
  }

  const { error } = await admin.from("user_learning_progress").insert({
    tenant_id: profile.tenant_id,
    user_id: userId,
    path_id: pathId,
    item_type: itemType,
    item_id: itemId,
    completed: true,
    completed_at: now,
  });

  if (error) {
    throw new Error("Nao foi possivel salvar progresso.");
  }
}

function itemTypeLabel(itemType: LearningItemType) {
  const labels = {
    study_material: "Material",
    flashcard: "Flashcard",
    question: "Questao",
    psychosocial_question: "Pergunta psicossocial",
    simulation_template: "Simulado",
  } satisfies Record<LearningItemType, string>;

  return labels[itemType];
}

function itemTypePluralLabel(itemType: LearningItemType) {
  const labels = {
    study_material: "Materiais",
    flashcard: "Flashcards",
    question: "Questoes",
    psychosocial_question: "Entrevista psicossocial",
    simulation_template: "Simulados",
  } satisfies Record<LearningItemType, string>;

  return labels[itemType];
}

function groupDescription(
  itemType: LearningItemType,
  totalItems: number,
  completedItems: number,
  canAccess: boolean,
) {
  if (!canAccess) {
    return "Conteudo da sequencia premium bloqueado para a conta atual.";
  }

  return `${completedItems}/${totalItems} ${itemTypePluralLabel(itemType).toLowerCase()} concluidos nesta etapa.`;
}
