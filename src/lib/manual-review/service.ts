import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export type ManualReviewKind = "subjective" | "psychosocial";
export type ManualReviewStatus =
  Database["public"]["Tables"]["subjective_attempts"]["Row"]["status"];
type AccessStatus = Database["public"]["Tables"]["profiles"]["Row"]["access_status"];
type LearningLanguage =
  Database["public"]["Tables"]["questions"]["Row"]["language"];
type LearningDifficulty =
  Database["public"]["Tables"]["questions"]["Row"]["difficulty"];

type ProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "tenant_id" | "email" | "full_name" | "access_status" | "role"
>;
type CategoryRow = Pick<
  Database["public"]["Tables"]["question_categories"]["Row"],
  "id" | "tenant_id" | "name" | "slug" | "language"
>;
type QuestionBankRow = Pick<
  Database["public"]["Tables"]["question_banks"]["Row"],
  "id" | "tenant_id" | "title" | "is_active" | "is_premium"
>;
type QuestionRow = Pick<
  Database["public"]["Tables"]["questions"]["Row"],
  | "id"
  | "tenant_id"
  | "bank_id"
  | "category_id"
  | "editorial_id"
  | "statement"
  | "explanation"
  | "difficulty"
  | "language"
  | "is_active"
>;
type PsychosocialQuestionRow = Pick<
  Database["public"]["Tables"]["psychosocial_questions"]["Row"],
  | "id"
  | "tenant_id"
  | "editorial_id"
  | "category"
  | "question"
  | "ideal_answer_guidelines"
  | "common_mistakes"
  | "is_premium"
  | "is_active"
>;
type SubjectiveAttemptRow =
  Database["public"]["Tables"]["subjective_attempts"]["Row"];
type PsychosocialAttemptRow =
  Database["public"]["Tables"]["psychosocial_attempts"]["Row"];

export type ManualQuestionCard = {
  id: string;
  title: string;
  prompt: string;
  categoryName: string;
  categorySlug: string | null;
  language: LearningLanguage;
  difficulty: LearningDifficulty;
  isPremium: boolean;
  canSubmit: boolean;
  latestStatus: ManualReviewStatus | null;
  latestScore: number | null;
};

export type ManualQuestionDetail = ManualQuestionCard & {
  answerGuidance: string | null;
  rubric: string | null;
  attempts: ManualAttemptCard[];
};

export type PsychosocialQuestionCard = {
  id: string;
  title: string;
  categoryName: string;
  isPremium: boolean;
  canSubmit: boolean;
  latestStatus: ManualReviewStatus | null;
  latestScore: number | null;
};

export type PsychosocialQuestionDetail = PsychosocialQuestionCard & {
  idealAnswerGuidelines: string | null;
  commonMistakes: string | null;
  attempts: ManualAttemptCard[];
};

export type ManualAttemptCard = {
  id: string;
  kind: ManualReviewKind;
  title: string;
  categoryName: string;
  language: LearningLanguage | "psychosocial";
  difficulty: LearningDifficulty | "mixed";
  answerText: string;
  status: ManualReviewStatus;
  score: number | null;
  maxScore: number;
  feedback: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

export type ManualReviewQueueItem = ManualAttemptCard & {
  userId: string;
  studentName: string;
  studentEmail: string | null;
  guidance: string | null;
  commonMistakes: string | null;
};

export type ManualReviewStats = {
  subjectiveSubmitted: number;
  subjectivePending: number;
  subjectiveReviewed: number;
  subjectiveAverage: number;
  psychosocialSubmitted: number;
  psychosocialPending: number;
  psychosocialReviewed: number;
  psychosocialAverage: number;
  feedbacksReceived: number;
};

export type ManualReviewFilters = {
  search?: string;
  language?: string;
  category?: string;
  difficulty?: string;
};

const statusLabels: Record<ManualReviewStatus, string> = {
  pending: "Pendente",
  reviewed: "Corrigida",
  returned: "Devolvida",
};

export { statusLabels as manualReviewStatusLabels };

function hasPaidAccess(profile: Pick<ProfileRow, "access_status" | "role">) {
  return profile.access_status === "paid" || profile.role === "admin";
}

function isTenantVisible(tenantId: string | null, profile: ProfileRow) {
  return tenantId === null || tenantId === profile.tenant_id;
}

function canAccessPremium(isPremium: boolean, profile: ProfileRow) {
  return !isPremium || hasPaidAccess(profile);
}

function normalizeAnswer(value: string) {
  const answer = value.trim();

  if (answer.length < 20) {
    throw new Error("Escreva uma resposta com pelo menos 20 caracteres.");
  }
  if (answer.length > 12000) {
    throw new Error("A resposta deve ter no maximo 12000 caracteres.");
  }

  return answer;
}

function normalizeScore(score: number, maxScore: number) {
  if (!Number.isFinite(maxScore) || maxScore <= 0 || maxScore > 100) {
    throw new Error("Nota maxima invalida.");
  }
  if (!Number.isFinite(score) || score < 0 || score > maxScore) {
    throw new Error("Nota deve ficar entre 0 e a nota maxima.");
  }

  return Number(score.toFixed(2));
}

function isReviewedStatus(status: ManualReviewStatus) {
  return status === "reviewed" || status === "returned";
}

function round(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(2));
}

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
    guidance: competencies || remaining || null,
    rubric: rubric || null,
  };
}

async function getProfile(userId: string): Promise<ProfileRow> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, tenant_id, email, full_name, access_status, role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Perfil do aluno nao encontrado.");
  }

  return data as ProfileRow;
}

async function getCategories(profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("question_categories")
    .select("id, tenant_id, name, slug, language")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Nao foi possivel consultar categorias.");
  }

  return ((data ?? []) as CategoryRow[]).filter((category) =>
    isTenantVisible(category.tenant_id, profile),
  );
}

async function getQuestionBanks(bankIds: string[]) {
  if (bankIds.length === 0) return [];
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("question_banks")
    .select("id, tenant_id, title, is_active, is_premium")
    .in("id", [...new Set(bankIds)]);

  if (error) {
    throw new Error("Nao foi possivel consultar bancos de questoes.");
  }

  return (data ?? []) as QuestionBankRow[];
}

async function getSubjectiveAttempts(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("subjective_attempts")
    .select(
      "id, tenant_id, user_id, question_id, answer_text, status, score, max_score, feedback, reviewed_by, reviewed_at, created_at, updated_at",
    )
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Nao foi possivel consultar respostas subjetivas.");
  }

  return (data ?? []) as SubjectiveAttemptRow[];
}

async function getPsychosocialAttempts(userId: string, profile: ProfileRow) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("psychosocial_attempts")
    .select(
      "id, tenant_id, user_id, psychosocial_question_id, answer_text, status, score, max_score, feedback, reviewed_by, reviewed_at, created_at, updated_at",
    )
    .eq("tenant_id", profile.tenant_id)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Nao foi possivel consultar respostas psicossociais.");
  }

  return (data ?? []) as PsychosocialAttemptRow[];
}

function latestSubjectiveAttempt(
  attempts: SubjectiveAttemptRow[],
  questionId: string,
) {
  return attempts.find((attempt) => attempt.question_id === questionId) ?? null;
}

function latestPsychosocialAttempt(
  attempts: PsychosocialAttemptRow[],
  questionId: string,
) {
  return (
    attempts.find((attempt) => attempt.psychosocial_question_id === questionId) ??
    null
  );
}

function matchesFilters(
  item: {
    title: string;
    categorySlug?: string | null;
    categoryName: string;
    language: string;
    difficulty?: string;
  },
  filters: ManualReviewFilters,
) {
  const search = filters.search?.trim().toLowerCase() ?? "";

  return (
    (!search ||
      item.title.toLowerCase().includes(search) ||
      item.categoryName.toLowerCase().includes(search)) &&
    (!filters.language || item.language === filters.language) &&
    (!filters.difficulty || item.difficulty === filters.difficulty) &&
    (!filters.category || item.categorySlug === filters.category)
  );
}

function subjectiveToCard(
  question: QuestionRow,
  category: CategoryRow | null,
  bank: QuestionBankRow,
  profile: ProfileRow,
  attempt: SubjectiveAttemptRow | null,
): ManualQuestionCard {
  return {
    id: question.id,
    title: question.editorial_id ?? question.statement.slice(0, 90),
    prompt: question.statement,
    categoryName: category?.name ?? "Sem categoria",
    categorySlug: category?.slug ?? null,
    language: question.language,
    difficulty: question.difficulty,
    isPremium: bank.is_premium,
    canSubmit: hasPaidAccess(profile) && canAccessPremium(bank.is_premium, profile),
    latestStatus: attempt?.status ?? null,
    latestScore: attempt?.score ?? null,
  };
}

function psychosocialToCard(
  question: PsychosocialQuestionRow,
  profile: ProfileRow,
  attempt: PsychosocialAttemptRow | null,
): PsychosocialQuestionCard {
  return {
    id: question.id,
    title: question.question,
    categoryName: question.category,
    isPremium: question.is_premium,
    canSubmit: hasPaidAccess(profile) && canAccessPremium(question.is_premium, profile),
    latestStatus: attempt?.status ?? null,
    latestScore: attempt?.score ?? null,
  };
}

export async function getSubjectiveQuestionList(
  userId: string,
  filters: ManualReviewFilters,
) {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const [categories, attempts, questionsResponse] = await Promise.all([
    getCategories(profile),
    getSubjectiveAttempts(userId, profile),
    admin
      .from("questions")
      .select(
        "id, tenant_id, bank_id, category_id, editorial_id, statement, explanation, difficulty, language, is_active",
      )
      .eq("type", "subjective")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  if (questionsResponse.error) {
    throw new Error("Nao foi possivel consultar questoes subjetivas.");
  }

  const questions = ((questionsResponse.data ?? []) as QuestionRow[]).filter(
    (question) => isTenantVisible(question.tenant_id, profile),
  );
  const banks = await getQuestionBanks(questions.map((question) => question.bank_id));
  const bankById = new Map(banks.map((bank) => [bank.id, bank]));
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const cards = questions
    .map((question) => {
      const bank = bankById.get(question.bank_id);
      if (!bank || !bank.is_active || !isTenantVisible(bank.tenant_id, profile)) {
        return null;
      }
      const category = question.category_id
        ? categoryById.get(question.category_id) ?? null
        : null;
      return subjectiveToCard(
        question,
        category,
        bank,
        profile,
        latestSubjectiveAttempt(attempts, question.id),
      );
    })
    .filter((card): card is ManualQuestionCard => Boolean(card))
    .filter((card) => matchesFilters(card, filters));

  return {
    accessStatus: profile.access_status as AccessStatus,
    hasPaidAccess: hasPaidAccess(profile),
    questions: cards,
    filterOptions: {
      categories: [...new Map(cards.map((card) => [card.categorySlug ?? "", card])).values()]
        .filter((card) => card.categorySlug)
        .map((card) => ({ slug: card.categorySlug as string, name: card.categoryName })),
      languages: [...new Set(cards.map((card) => card.language))],
      difficulties: [...new Set(cards.map((card) => card.difficulty))],
    },
  };
}

export async function getSubjectiveQuestionDetail(userId: string, questionId: string) {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const [categories, attempts, questionResponse] = await Promise.all([
    getCategories(profile),
    getSubjectiveAttempts(userId, profile),
    admin
      .from("questions")
      .select(
        "id, tenant_id, bank_id, category_id, editorial_id, statement, explanation, difficulty, language, is_active",
      )
      .eq("id", questionId)
      .eq("type", "subjective")
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  if (questionResponse.error) {
    throw new Error("Nao foi possivel consultar questao subjetiva.");
  }
  if (!questionResponse.data) return null;

  const question = questionResponse.data as QuestionRow;
  if (!isTenantVisible(question.tenant_id, profile)) return null;

  const [bank] = await getQuestionBanks([question.bank_id]);
  if (!bank || !bank.is_active || !isTenantVisible(bank.tenant_id, profile)) return null;

  const category = question.category_id
    ? categories.find((item) => item.id === question.category_id) ?? null
    : null;
  const parsedExplanation = parseSubjectiveExplanation(question.explanation);

  return {
    accessStatus: profile.access_status as AccessStatus,
    hasPaidAccess: hasPaidAccess(profile),
    question: {
      ...subjectiveToCard(
        question,
        category,
        bank,
        profile,
        latestSubjectiveAttempt(attempts, question.id),
      ),
      answerGuidance: parsedExplanation.guidance,
      rubric: parsedExplanation.rubric,
      attempts: attempts
        .filter((attempt) => attempt.question_id === question.id)
        .map((attempt) =>
          subjectiveAttemptToCard(attempt, question, category, "Resposta subjetiva"),
        ),
    } satisfies ManualQuestionDetail,
  };
}

export async function submitSubjectiveAnswer(
  userId: string,
  questionId: string,
  answerText: string,
) {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const answer = normalizeAnswer(answerText);

  if (!hasPaidAccess(profile)) {
    throw new Error("Envio de subjetivas e correcao manual sao recursos premium.");
  }

  const detail = await getSubjectiveQuestionDetail(userId, questionId);
  if (!detail?.question.canSubmit) {
    throw new Error("Questao indisponivel para envio.");
  }
  if (detail.question.attempts.some((attempt) => attempt.status === "pending")) {
    throw new Error("Voce ja possui uma resposta pendente para esta questao.");
  }

  const { error } = await admin.from("subjective_attempts").insert({
    tenant_id: profile.tenant_id,
    user_id: userId,
    question_id: questionId,
    answer_text: answer,
    status: "pending",
    max_score: 10,
  });

  if (error) {
    throw new Error("Nao foi possivel enviar resposta subjetiva.");
  }
}

export async function getPsychosocialQuestionList(userId: string) {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const [attempts, questionsResponse] = await Promise.all([
    getPsychosocialAttempts(userId, profile),
    admin
      .from("psychosocial_questions")
      .select(
        "id, tenant_id, editorial_id, category, question, ideal_answer_guidelines, common_mistakes, is_premium, is_active",
      )
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("question", { ascending: true }),
  ]);

  if (questionsResponse.error) {
    throw new Error("Nao foi possivel consultar perguntas psicossociais.");
  }

  const questions = ((questionsResponse.data ?? []) as PsychosocialQuestionRow[])
    .filter((question) => isTenantVisible(question.tenant_id, profile))
    .map((question) =>
      psychosocialToCard(
        question,
        profile,
        latestPsychosocialAttempt(attempts, question.id),
      ),
    );

  return {
    accessStatus: profile.access_status as AccessStatus,
    hasPaidAccess: hasPaidAccess(profile),
    questions,
    groups: [...new Set(questions.map((question) => question.categoryName))].map(
      (category) => ({
        category,
        questions: questions.filter((question) => question.categoryName === category),
      }),
    ),
  };
}

export async function getPsychosocialQuestionDetail(
  userId: string,
  questionId: string,
) {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const [attempts, questionResponse] = await Promise.all([
    getPsychosocialAttempts(userId, profile),
    admin
      .from("psychosocial_questions")
      .select(
        "id, tenant_id, editorial_id, category, question, ideal_answer_guidelines, common_mistakes, is_premium, is_active",
      )
      .eq("id", questionId)
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  if (questionResponse.error) {
    throw new Error("Nao foi possivel consultar pergunta psicossocial.");
  }
  if (!questionResponse.data) return null;

  const question = questionResponse.data as PsychosocialQuestionRow;
  if (!isTenantVisible(question.tenant_id, profile)) return null;

  return {
    accessStatus: profile.access_status as AccessStatus,
    hasPaidAccess: hasPaidAccess(profile),
    question: {
      ...psychosocialToCard(
        question,
        profile,
        latestPsychosocialAttempt(attempts, question.id),
      ),
      idealAnswerGuidelines: question.ideal_answer_guidelines,
      commonMistakes: question.common_mistakes,
      attempts: attempts
        .filter((attempt) => attempt.psychosocial_question_id === question.id)
        .map((attempt) => psychosocialAttemptToCard(attempt, question)),
    } satisfies PsychosocialQuestionDetail,
  };
}

export async function submitPsychosocialAnswer(
  userId: string,
  questionId: string,
  answerText: string,
) {
  const admin = getSupabaseAdminClient();
  const profile = await getProfile(userId);
  const answer = normalizeAnswer(answerText);

  if (!hasPaidAccess(profile)) {
    throw new Error("Envio de entrevista psicossocial e correcao manual sao recursos premium.");
  }

  const detail = await getPsychosocialQuestionDetail(userId, questionId);
  if (!detail?.question.canSubmit) {
    throw new Error("Pergunta indisponivel para envio.");
  }
  if (detail.question.attempts.some((attempt) => attempt.status === "pending")) {
    throw new Error("Voce ja possui uma resposta pendente para esta pergunta.");
  }

  const { error } = await admin.from("psychosocial_attempts").insert({
    tenant_id: profile.tenant_id,
    user_id: userId,
    psychosocial_question_id: questionId,
    answer_text: answer,
    status: "pending",
    max_score: 10,
  });

  if (error) {
    throw new Error("Nao foi possivel enviar resposta psicossocial.");
  }
}

function subjectiveAttemptToCard(
  attempt: SubjectiveAttemptRow,
  question: QuestionRow | null,
  category: CategoryRow | null,
  fallbackTitle: string,
): ManualAttemptCard {
  return {
    id: attempt.id,
    kind: "subjective",
    title: question?.editorial_id ?? question?.statement.slice(0, 90) ?? fallbackTitle,
    categoryName: category?.name ?? "Sem categoria",
    language: question?.language ?? "mixed",
    difficulty: question?.difficulty ?? "mixed",
    answerText: attempt.answer_text,
    status: attempt.status,
    score: attempt.score,
    maxScore: attempt.max_score,
    feedback: attempt.feedback,
    createdAt: attempt.created_at,
    reviewedAt: attempt.reviewed_at,
  };
}

function psychosocialAttemptToCard(
  attempt: PsychosocialAttemptRow,
  question: PsychosocialQuestionRow | null,
): ManualAttemptCard {
  return {
    id: attempt.id,
    kind: "psychosocial",
    title: question?.question ?? "Treino psicossocial",
    categoryName: question?.category ?? "Psicossocial",
    language: "psychosocial",
    difficulty: "mixed",
    answerText: attempt.answer_text,
    status: attempt.status,
    score: attempt.score,
    maxScore: attempt.max_score,
    feedback: attempt.feedback,
    createdAt: attempt.created_at,
    reviewedAt: attempt.reviewed_at,
  };
}

export async function getStudentManualAttempts(userId: string) {
  const profile = await getProfile(userId);
  const [subjectiveAttempts, psychosocialAttempts] = await Promise.all([
    getSubjectiveAttempts(userId, profile),
    getPsychosocialAttempts(userId, profile),
  ]);
  const admin = getSupabaseAdminClient();
  const questionIds = [...new Set(subjectiveAttempts.map((attempt) => attempt.question_id))];
  const psychosocialIds = [
    ...new Set(
      psychosocialAttempts.map((attempt) => attempt.psychosocial_question_id),
    ),
  ];
  const [categories, questionsResponse, psychosocialResponse] = await Promise.all([
    getCategories(profile),
    questionIds.length
      ? admin
          .from("questions")
          .select(
            "id, tenant_id, bank_id, category_id, editorial_id, statement, explanation, difficulty, language, is_active",
          )
          .in("id", questionIds)
      : Promise.resolve({ data: [], error: null }),
    psychosocialIds.length
      ? admin
          .from("psychosocial_questions")
          .select(
            "id, tenant_id, editorial_id, category, question, ideal_answer_guidelines, common_mistakes, is_premium, is_active",
          )
          .in("id", psychosocialIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (questionsResponse.error || psychosocialResponse.error) {
    throw new Error("Nao foi possivel consultar historico de respostas.");
  }

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const questionById = new Map(
    ((questionsResponse.data ?? []) as QuestionRow[]).map((question) => [
      question.id,
      question,
    ]),
  );
  const psychosocialById = new Map(
    ((psychosocialResponse.data ?? []) as PsychosocialQuestionRow[]).map(
      (question) => [question.id, question],
    ),
  );
  const subjectiveCards = subjectiveAttempts.map((attempt) => {
    const question = questionById.get(attempt.question_id) ?? null;
    const category = question?.category_id
      ? categoryById.get(question.category_id) ?? null
      : null;
    return subjectiveAttemptToCard(attempt, question, category, "Resposta subjetiva");
  });
  const psychosocialCards = psychosocialAttempts.map((attempt) =>
    psychosocialAttemptToCard(
      attempt,
      psychosocialById.get(attempt.psychosocial_question_id) ?? null,
    ),
  );

  return {
    accessStatus: profile.access_status as AccessStatus,
    hasPaidAccess: hasPaidAccess(profile),
    attempts: [...subjectiveCards, ...psychosocialCards].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    ),
  };
}

export async function getManualReviewStats(userId: string): Promise<ManualReviewStats> {
  const profile = await getProfile(userId);
  const [subjectiveAttempts, psychosocialAttempts] = await Promise.all([
    getSubjectiveAttempts(userId, profile),
    getPsychosocialAttempts(userId, profile),
  ]);
  const subjectiveReviewed = subjectiveAttempts.filter((attempt) =>
    isReviewedStatus(attempt.status),
  );
  const psychosocialReviewed = psychosocialAttempts.filter((attempt) =>
    isReviewedStatus(attempt.status),
  );
  const feedbacksReceived = [...subjectiveAttempts, ...psychosocialAttempts].filter(
    (attempt) => attempt.feedback,
  ).length;

  return {
    subjectiveSubmitted: subjectiveAttempts.length,
    subjectivePending: subjectiveAttempts.filter((attempt) => attempt.status === "pending")
      .length,
    subjectiveReviewed: subjectiveReviewed.length,
    subjectiveAverage:
      subjectiveReviewed.length === 0
        ? 0
        : round(
            subjectiveReviewed.reduce(
              (sum, attempt) => sum + ((attempt.score ?? 0) / attempt.max_score) * 100,
              0,
            ) / subjectiveReviewed.length,
          ),
    psychosocialSubmitted: psychosocialAttempts.length,
    psychosocialPending: psychosocialAttempts.filter(
      (attempt) => attempt.status === "pending",
    ).length,
    psychosocialReviewed: psychosocialReviewed.length,
    psychosocialAverage:
      psychosocialReviewed.length === 0
        ? 0
        : round(
            psychosocialReviewed.reduce(
              (sum, attempt) => sum + ((attempt.score ?? 0) / attempt.max_score) * 100,
              0,
            ) / psychosocialReviewed.length,
          ),
    feedbacksReceived,
  };
}

async function getProfilesById(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, ProfileRow>();
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, tenant_id, email, full_name, access_status, role")
    .in("id", [...new Set(userIds)]);

  if (error) {
    throw new Error("Nao foi possivel consultar alunos.");
  }

  return new Map(((data ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]));
}

export async function getAdminManualReviewQueue(tab: string) {
  const admin = getSupabaseAdminClient();
  const subjectiveStatus =
    tab === "subjective-pending" ? "pending" : tab === "reviewed" ? null : null;
  const psychosocialStatus =
    tab === "psychosocial-pending" ? "pending" : tab === "reviewed" ? null : null;
  const includeSubjective = tab !== "psychosocial-pending";
  const includePsychosocial = tab !== "subjective-pending";
  const [subjectiveResponse, psychosocialResponse] = await Promise.all([
    includeSubjective
      ? admin
          .from("subjective_attempts")
          .select(
            "id, tenant_id, user_id, question_id, answer_text, status, score, max_score, feedback, reviewed_by, reviewed_at, created_at, updated_at",
          )
          .order("created_at", { ascending: false })
          .limit(120)
      : Promise.resolve({ data: [], error: null }),
    includePsychosocial
      ? admin
          .from("psychosocial_attempts")
          .select(
            "id, tenant_id, user_id, psychosocial_question_id, answer_text, status, score, max_score, feedback, reviewed_by, reviewed_at, created_at, updated_at",
          )
          .order("created_at", { ascending: false })
          .limit(120)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (subjectiveResponse.error || psychosocialResponse.error) {
    throw new Error("Nao foi possivel consultar fila de correcoes.");
  }

  let subjectiveAttempts = (subjectiveResponse.data ?? []) as SubjectiveAttemptRow[];
  let psychosocialAttempts = (psychosocialResponse.data ?? []) as PsychosocialAttemptRow[];

  if (subjectiveStatus) {
    subjectiveAttempts = subjectiveAttempts.filter(
      (attempt) => attempt.status === subjectiveStatus,
    );
  }
  if (psychosocialStatus) {
    psychosocialAttempts = psychosocialAttempts.filter(
      (attempt) => attempt.status === psychosocialStatus,
    );
  }
  if (tab === "reviewed") {
    subjectiveAttempts = subjectiveAttempts.filter((attempt) =>
      isReviewedStatus(attempt.status),
    );
    psychosocialAttempts = psychosocialAttempts.filter((attempt) =>
      isReviewedStatus(attempt.status),
    );
  }

  const userById = await getProfilesById([
    ...subjectiveAttempts.map((attempt) => attempt.user_id),
    ...psychosocialAttempts.map((attempt) => attempt.user_id),
  ]);
  const questionIds = [...new Set(subjectiveAttempts.map((attempt) => attempt.question_id))];
  const psychosocialIds = [
    ...new Set(
      psychosocialAttempts.map((attempt) => attempt.psychosocial_question_id),
    ),
  ];
  const [categories, questionsResponse, psychosocialQuestionsResponse] =
    await Promise.all([
      getCategories({
        id: "admin",
        tenant_id: "",
        email: null,
        full_name: null,
        access_status: "paid",
        role: "admin",
      }),
      questionIds.length
        ? admin
            .from("questions")
            .select(
              "id, tenant_id, bank_id, category_id, editorial_id, statement, explanation, difficulty, language, is_active",
            )
            .in("id", questionIds)
        : Promise.resolve({ data: [], error: null }),
      psychosocialIds.length
        ? admin
            .from("psychosocial_questions")
            .select(
              "id, tenant_id, editorial_id, category, question, ideal_answer_guidelines, common_mistakes, is_premium, is_active",
            )
            .in("id", psychosocialIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (questionsResponse.error || psychosocialQuestionsResponse.error) {
    throw new Error("Nao foi possivel montar fila de correcoes.");
  }

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const questionById = new Map(
    ((questionsResponse.data ?? []) as QuestionRow[]).map((question) => [
      question.id,
      question,
    ]),
  );
  const psychosocialById = new Map(
    ((psychosocialQuestionsResponse.data ?? []) as PsychosocialQuestionRow[]).map(
      (question) => [question.id, question],
    ),
  );
  const subjectiveItems = subjectiveAttempts.map((attempt) => {
    const question = questionById.get(attempt.question_id) ?? null;
    const category = question?.category_id
      ? categoryById.get(question.category_id) ?? null
      : null;
    const parsed = parseSubjectiveExplanation(question?.explanation ?? null);
    return {
      ...subjectiveAttemptToCard(attempt, question, category, "Resposta subjetiva"),
      userId: attempt.user_id,
      studentName: userById.get(attempt.user_id)?.full_name ?? "Aluno",
      studentEmail: userById.get(attempt.user_id)?.email ?? null,
      guidance: parsed.guidance,
      commonMistakes: parsed.rubric,
    } satisfies ManualReviewQueueItem;
  });
  const psychosocialItems = psychosocialAttempts.map((attempt) => {
    const question = psychosocialById.get(attempt.psychosocial_question_id) ?? null;
    return {
      ...psychosocialAttemptToCard(attempt, question),
      userId: attempt.user_id,
      studentName: userById.get(attempt.user_id)?.full_name ?? "Aluno",
      studentEmail: userById.get(attempt.user_id)?.email ?? null,
      guidance: question?.ideal_answer_guidelines ?? null,
      commonMistakes: question?.common_mistakes ?? null,
    } satisfies ManualReviewQueueItem;
  });
  const items = [...subjectiveItems, ...psychosocialItems]
    .filter((item) => (tab === "all" ? true : tab === "reviewed" ? isReviewedStatus(item.status) : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    tab,
    items,
    stats: {
      subjectivePending: subjectiveAttempts.filter((attempt) => attempt.status === "pending").length,
      psychosocialPending: psychosocialAttempts.filter((attempt) => attempt.status === "pending").length,
      reviewed: items.filter((item) => isReviewedStatus(item.status)).length,
      total: items.length,
    },
  };
}

export async function reviewManualAttempt(input: {
  reviewerId: string;
  kind: ManualReviewKind;
  attemptId: string;
  score: number;
  maxScore: number;
  feedback: string;
  status: ManualReviewStatus;
}) {
  if (!isReviewedStatus(input.status)) {
    throw new Error("Status de correcao invalido.");
  }
  const feedback = input.feedback.trim();
  if (feedback.length < 5) {
    throw new Error("Feedback precisa ter pelo menos 5 caracteres.");
  }
  const score = normalizeScore(input.score, input.maxScore);
  const payload = {
    score,
    max_score: Number(input.maxScore.toFixed(2)),
    feedback: feedback.slice(0, 12000),
    status: input.status,
    reviewed_by: input.reviewerId,
    reviewed_at: new Date().toISOString(),
  };
  const admin = getSupabaseAdminClient();
  const response =
    input.kind === "subjective"
      ? await admin.from("subjective_attempts").update(payload).eq("id", input.attemptId)
      : await admin
          .from("psychosocial_attempts")
          .update(payload)
          .eq("id", input.attemptId);

  if (response.error) {
    throw new Error("Nao foi possivel salvar correcao manual.");
  }
}
