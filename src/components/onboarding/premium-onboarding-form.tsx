"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { completePremiumOnboardingAction } from "@/app/(app)/onboarding/actions";
import type {
  OnboardingInput,
  OnboardingLanguage,
  OnboardingMainGoal,
  OnboardingSchoolYear,
  OnboardingStudyTime,
} from "@/lib/mission/rules";

type PremiumOnboardingFormProps = {
  errorMessage?: string | null;
};

type StepId =
  | "idioma"
  | "anoEscolar"
  | "tempoDisponivel"
  | "jaParticipouPgm"
  | "objetivoPrincipal";

const steps: Array<{ id: StepId; title: string; eyebrow: string }> = [
  { id: "idioma", title: "Idioma escolhido", eyebrow: "Passo 1" },
  { id: "anoEscolar", title: "Ano escolar", eyebrow: "Passo 2" },
  { id: "tempoDisponivel", title: "Tempo disponível por dia", eyebrow: "Passo 3" },
  { id: "jaParticipouPgm", title: "Histórico no PGM", eyebrow: "Passo 4" },
  { id: "objetivoPrincipal", title: "Objetivo principal", eyebrow: "Passo 5" },
];

const languageOptions: Array<{
  value: OnboardingLanguage;
  label: string;
  description: string;
}> = [
  {
    value: "english",
    label: "Inglês",
    description: "Plano com trilhas e flashcards voltados ao inglês.",
  },
  {
    value: "spanish",
    label: "Espanhol",
    description: "Plano com trilhas e flashcards voltados ao espanhol.",
  },
];

const schoolYearOptions: Array<{
  value: OnboardingSchoolYear;
  label: string;
  description: string;
}> = [
  { value: "first", label: "1º ano", description: "Preparação desde a base." },
  { value: "second", label: "2º ano", description: "Ritmo focado em edital e prova." },
  { value: "third", label: "3º ano", description: "Revisão objetiva e treino intensivo." },
];

const studyTimeOptions: Array<{
  value: OnboardingStudyTime;
  label: string;
  description: string;
}> = [
  { value: "15m", label: "15 minutos", description: "Missões curtas e objetivas." },
  { value: "30m", label: "30 minutos", description: "Rotina diária equilibrada." },
  { value: "1h", label: "1 hora", description: "Mais questões e revisão guiada." },
  { value: "2h_plus", label: "2 horas ou mais", description: "Ritmo intensivo de preparação." },
];

const previousPgmOptions = [
  { value: "yes", label: "Sim", description: "O plano prioriza correção de lacunas." },
  { value: "no", label: "Não", description: "O plano começa por diagnóstico e base." },
];

const goalOptions: Array<{
  value: OnboardingMainGoal;
  label: string;
  description: string;
}> = [
  { value: "improve_english", label: "Melhorar inglês", description: "Foco em idioma e vocabulário." },
  { value: "improve_spanish", label: "Melhorar espanhol", description: "Foco em idioma e vocabulário." },
  { value: "pass_exam", label: "Passar na prova", description: "Foco em prova objetiva e estratégia." },
  { value: "improve_writing", label: "Melhorar escrita", description: "Foco em subjetivas oficiais." },
  {
    value: "improve_interview",
    label: "Melhorar entrevista psicossocial",
    description: "Foco em entrevista e clareza de resposta.",
  },
];

function SubmitButton({ enabled }: { enabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={!enabled || pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="size-4" aria-hidden="true" />
      )}
      Gerar plano automático
    </button>
  );
}

export function PremiumOnboardingForm({
  errorMessage,
}: PremiumOnboardingFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<OnboardingInput>({
    idioma: "english",
    anoEscolar: "first",
    tempoDisponivel: "30m",
    jaParticipouPgm: false,
    objetivoPrincipal: "pass_exam",
  });
  const currentStep = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const canSubmit = useMemo(
    () =>
      Boolean(
        form.idioma &&
          form.anoEscolar &&
          form.tempoDisponivel &&
          form.objetivoPrincipal,
      ),
    [form],
  );

  function OptionButton<T extends string>({
    value,
    label,
    description,
    selected,
    onSelect,
  }: {
    value: T;
    label: string;
    description: string;
    selected: boolean;
    onSelect: (value: T) => void;
  }) {
    return (
      <button
        type="button"
        onClick={() => onSelect(value)}
        className={`rounded-md border p-4 text-left transition ${
          selected
            ? "border-pgm-yellow bg-pgm-yellow/10"
            : "border-border-soft bg-background hover:border-white/35"
        }`}
      >
        <span className="flex items-start justify-between gap-3">
          <span>
            <span className="block text-sm font-semibold text-white">
              {label}
            </span>
            <span className="mt-2 block text-sm leading-6 text-muted">
              {description}
            </span>
          </span>
          {selected ? (
            <CheckCircle2
              className="size-5 shrink-0 text-pgm-yellow"
              aria-hidden="true"
            />
          ) : null}
        </span>
      </button>
    );
  }

  return (
    <form action={completePremiumOnboardingAction}>
      <input type="hidden" name="idioma" value={form.idioma} />
      <input type="hidden" name="ano_escolar" value={form.anoEscolar} />
      <input type="hidden" name="tempo_disponivel" value={form.tempoDisponivel} />
      <input
        type="hidden"
        name="ja_participou_pgm"
        value={form.jaParticipouPgm ? "yes" : "no"}
      />
      <input
        type="hidden"
        name="objetivo_principal"
        value={form.objetivoPrincipal}
      />

      <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              {currentStep.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {currentStep.title}
            </h2>
          </div>
          <span className="rounded-md border border-border-soft px-3 py-2 font-mono text-sm font-semibold text-muted">
            {stepIndex + 1}/{steps.length}
          </span>
        </div>

        <div className="mt-5 h-2 rounded-full bg-background">
          <div
            className="h-2 rounded-full bg-pgm-yellow transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {errorMessage ? (
          <div className="mt-5 rounded-md border border-red-300/40 bg-red-400/10 p-4">
            <p className="text-sm font-semibold text-red-200">
              {errorMessage}
            </p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3">
          {currentStep.id === "idioma"
            ? languageOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  {...option}
                  selected={form.idioma === option.value}
                  onSelect={(idioma) => setForm((current) => ({ ...current, idioma }))}
                />
              ))
            : null}

          {currentStep.id === "anoEscolar"
            ? schoolYearOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  {...option}
                  selected={form.anoEscolar === option.value}
                  onSelect={(anoEscolar) =>
                    setForm((current) => ({ ...current, anoEscolar }))
                  }
                />
              ))
            : null}

          {currentStep.id === "tempoDisponivel"
            ? studyTimeOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  {...option}
                  selected={form.tempoDisponivel === option.value}
                  onSelect={(tempoDisponivel) =>
                    setForm((current) => ({ ...current, tempoDisponivel }))
                  }
                />
              ))
            : null}

          {currentStep.id === "jaParticipouPgm"
            ? previousPgmOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  {...option}
                  selected={
                    form.jaParticipouPgm === (option.value === "yes")
                  }
                  onSelect={(value) =>
                    setForm((current) => ({
                      ...current,
                      jaParticipouPgm: value === "yes",
                    }))
                  }
                />
              ))
            : null}

          {currentStep.id === "objetivoPrincipal"
            ? goalOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  {...option}
                  selected={form.objetivoPrincipal === option.value}
                  onSelect={(objetivoPrincipal) =>
                    setForm((current) => ({ ...current, objetivoPrincipal }))
                  }
                />
              ))
            : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
            disabled={stepIndex === 0}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-5 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar
          </button>

          {stepIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={() =>
                setStepIndex((current) => Math.min(current + 1, steps.length - 1))
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
            >
              Continuar
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <SubmitButton enabled={canSubmit} />
          )}
        </div>
      </section>
    </form>
  );
}
