"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";

import { saveEligibilityAssessmentAction } from "@/app/diagnostico/actions";
import {
  evaluateEligibility,
  pgm2026Rules,
  type EligibilityInput,
  type EligibilityResult,
  type SchoolYear,
} from "@/lib/eligibility/rules";
import { EligibilityResultPanel } from "@/components/eligibility/eligibility-result";

type BooleanChoice = "" | "yes" | "no";

type FormState = {
  birthDate: string;
  schoolYear: "" | SchoolYear;
  hasStateSchoolEnrollment: BooleanChoice;
  hasActiveSiepeEnrollment: BooleanChoice;
  isExcludedSchool: BooleanChoice;
  attendancePercent: string;
  portugueseAverage: string;
  mathAverage: string;
  humanitiesAverage: string;
  hasPartialProgression: BooleanChoice;
  wasPreviouslySelected: BooleanChoice;
};

type EligibilityFormProps = {
  isAuthenticated: boolean;
};

const initialState: FormState = {
  birthDate: "",
  schoolYear: "",
  hasStateSchoolEnrollment: "",
  hasActiveSiepeEnrollment: "",
  isExcludedSchool: "",
  attendancePercent: "",
  portugueseAverage: "",
  mathAverage: "",
  humanitiesAverage: "",
  hasPartialProgression: "",
  wasPreviouslySelected: "",
};

export function EligibilityForm({ isAuthenticated }: EligibilityFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const academicReference = useMemo(() => {
    if (form.schoolYear === "first") {
      return "Use os dados do 1o trimestre ou 1o bimestre, conforme a organizacao da escola.";
    }

    if (form.schoolYear === "second") {
      return "Use os dados finais do 1o ano do Ensino Medio.";
    }

    return "Selecione a serie para ver a referencia correta das notas.";
  }, [form.schoolYear]);

  function updateField<Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeForm(form);

    if (!normalized) {
      setError("Preencha todos os campos com valores validos para gerar o diagnostico.");
      setResult(null);
      setSaveMessage(null);
      return;
    }

    const nextResult = evaluateEligibility(normalized);
    setError(null);
    setResult(nextResult);
    setSaveMessage(null);

    if (!isAuthenticated) {
      setSaveMessage("Crie uma conta ou entre para salvar este diagnostico no dashboard.");
      return;
    }

    setIsSaving(true);
    const saveResponse = await saveEligibilityAssessmentAction(normalized);
    setIsSaving(false);
    setSaveMessage(saveResponse.message);
  }

  function handleReset() {
    setForm(initialState);
    setResult(null);
    setError(null);
    setSaveMessage(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-md border border-border-soft bg-surface p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
              Diagnostico publico
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Dados do estudante
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex size-10 items-center justify-center rounded-md border border-border-soft text-muted transition hover:border-white/35 hover:text-white"
            aria-label="Limpar formulario"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <Field label="Data de nascimento" htmlFor="birthDate">
            <input
              id="birthDate"
              type="date"
              value={form.birthDate}
              onChange={(event) => updateField("birthDate", event.target.value)}
              className={inputClassName}
              min="2000-01-01"
              max="2026-12-31"
            />
          </Field>

          <Field label="Serie atual" htmlFor="schoolYear">
            <select
              id="schoolYear"
              value={form.schoolYear}
              onChange={(event) =>
                updateField("schoolYear", event.target.value as FormState["schoolYear"])
              }
              className={inputClassName}
            >
              <option value="">Selecione</option>
              <option value="first">1o ano do Ensino Medio</option>
              <option value="second">2o ano do Ensino Medio</option>
              <option value="other">Outra serie</option>
            </select>
          </Field>

          <div className="rounded-md border border-border-soft bg-background p-4 text-sm leading-6 text-muted">
            {academicReference}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ChoiceField
              label="Rede estadual de PE"
              value={form.hasStateSchoolEnrollment}
              onChange={(value) => updateField("hasStateSchoolEnrollment", value)}
            />
            <ChoiceField
              label="Cadastro ativo no SIEPE"
              value={form.hasActiveSiepeEnrollment}
              onChange={(value) => updateField("hasActiveSiepeEnrollment", value)}
            />
            <ChoiceField
              label="Escola em categoria excluida"
              value={form.isExcludedSchool}
              onChange={(value) => updateField("isExcludedSchool", value)}
            />
            <ChoiceField
              label="Progressao parcial em 2026"
              value={form.hasPartialProgression}
              onChange={(value) => updateField("hasPartialProgression", value)}
            />
            <ChoiceField
              label="Ja foi convocado pelo PGM"
              value={form.wasPreviouslySelected}
              onChange={(value) => updateField("wasPreviouslySelected", value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Frequencia (%)" htmlFor="attendancePercent">
              <input
                id="attendancePercent"
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                step="0.1"
                value={form.attendancePercent}
                onChange={(event) =>
                  updateField("attendancePercent", event.target.value)
                }
                className={inputClassName}
                placeholder="Ex.: 92"
              />
            </Field>

            <Field label="Media em Portugues" htmlFor="portugueseAverage">
              <input
                id="portugueseAverage"
                type="number"
                inputMode="decimal"
                min="0"
                max="10"
                step="0.1"
                value={form.portugueseAverage}
                onChange={(event) =>
                  updateField("portugueseAverage", event.target.value)
                }
                className={inputClassName}
                placeholder="Ex.: 7.5"
              />
            </Field>

            <Field label="Media em Matematica" htmlFor="mathAverage">
              <input
                id="mathAverage"
                type="number"
                inputMode="decimal"
                min="0"
                max="10"
                step="0.1"
                value={form.mathAverage}
                onChange={(event) => updateField("mathAverage", event.target.value)}
                className={inputClassName}
                placeholder="Ex.: 8"
              />
            </Field>

            <Field label="Media em Humanas" htmlFor="humanitiesAverage">
              <input
                id="humanitiesAverage"
                type="number"
                inputMode="decimal"
                min="0"
                max="10"
                step="0.1"
                value={form.humanitiesAverage}
                onChange={(event) =>
                  updateField("humanitiesAverage", event.target.value)
                }
                className={inputClassName}
                placeholder="Ex.: 7"
              />
            </Field>
          </div>
        </div>

        {error ? (
          <p className="mt-5 rounded-md border border-pgm-red/40 bg-pgm-red/10 px-4 py-3 text-sm text-pgm-red">
            {error}
          </p>
        ) : null}

        {saveMessage ? (
          <div className="mt-5 rounded-md border border-border-soft bg-background px-4 py-3 text-sm leading-6 text-muted">
            <p>{saveMessage}</p>
            {!isAuthenticated ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-border-soft px-3 text-xs font-semibold text-white transition hover:border-white/35"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-pgm-yellow px-3 text-xs font-semibold text-background transition hover:bg-white"
                >
                  Criar conta
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Salvando..." : "Calcular elegibilidade"}
          <Calculator className="size-4" aria-hidden="true" />
        </button>

        <p className="mt-4 text-xs leading-5 text-muted">
          Regras baseadas no {pgm2026Rules.edital}. A validacao oficial usa
          dados institucionais, incluindo SIEPE.
        </p>
      </form>

      {result ? (
        <EligibilityResultPanel result={result} />
      ) : (
        <aside className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-green">
            Resultado
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Preencha o formulario para visualizar a analise.
          </h2>
          <div className="mt-6 grid gap-3">
            {[
              ["Elegivel", "Todos os criterios avaliados estao alinhados."],
              [
                "Parcialmente elegivel",
                "Ha ponto academico abaixo do minimo do edital.",
              ],
              [
                "Nao elegivel",
                "Ha requisito estrutural impeditivo no diagnostico.",
              ],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-md border border-border-soft bg-background p-4"
              >
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2" htmlFor={htmlFor}>
      <span className="text-sm font-medium text-white">{label}</span>
      {children}
    </label>
  );
}

function ChoiceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: BooleanChoice;
  onChange: (value: BooleanChoice) => void;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium text-white">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["yes", "Sim"],
          ["no", "Nao"],
        ].map(([optionValue, optionLabel]) => (
          <button
            key={optionValue}
            type="button"
            aria-pressed={value === optionValue}
            onClick={() => onChange(optionValue as BooleanChoice)}
            className={`h-11 rounded-md border px-3 text-sm font-semibold transition ${
              value === optionValue
                ? "border-pgm-yellow bg-pgm-yellow text-background"
                : "border-border-soft bg-background text-muted hover:border-white/35 hover:text-white"
            }`}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function normalizeForm(form: FormState): EligibilityInput | null {
  const requiredChoices = [
    form.birthDate,
    form.schoolYear,
    form.hasStateSchoolEnrollment,
    form.hasActiveSiepeEnrollment,
    form.isExcludedSchool,
    form.hasPartialProgression,
    form.wasPreviouslySelected,
  ];

  if (requiredChoices.some((value) => !value)) {
    return null;
  }

  const attendancePercent = parseDecimal(form.attendancePercent);
  const portugueseAverage = parseDecimal(form.portugueseAverage);
  const mathAverage = parseDecimal(form.mathAverage);
  const humanitiesAverage = parseDecimal(form.humanitiesAverage);

  if (
    !isWithin(attendancePercent, 0, 100) ||
    !isWithin(portugueseAverage, 0, 10) ||
    !isWithin(mathAverage, 0, 10) ||
    !isWithin(humanitiesAverage, 0, 10)
  ) {
    return null;
  }

  return {
    birthDate: form.birthDate,
    schoolYear: form.schoolYear as SchoolYear,
    hasStateSchoolEnrollment: form.hasStateSchoolEnrollment === "yes",
    hasActiveSiepeEnrollment: form.hasActiveSiepeEnrollment === "yes",
    isExcludedSchool: form.isExcludedSchool === "yes",
    attendancePercent,
    portugueseAverage,
    mathAverage,
    humanitiesAverage,
    hasPartialProgression: form.hasPartialProgression === "yes",
    wasPreviouslySelected: form.wasPreviouslySelected === "yes",
  };
}

function parseDecimal(value: string): number {
  return Number(value.replace(",", "."));
}

function isWithin(value: number, minimum: number, maximum: number): boolean {
  return Number.isFinite(value) && value >= minimum && value <= maximum;
}

const inputClassName =
  "h-12 w-full rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow";
