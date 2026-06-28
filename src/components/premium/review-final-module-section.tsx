import {
  AlertTriangle,
  BookOpenCheck,
  Compass,
  Languages,
  Lightbulb,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

import {
  ContentCard,
  FeatureHighlight,
  SectionHeader,
  StatusBadge,
} from "@/components/design-system";
import type { ReviewFinalModule } from "@/lib/review-final/content";

const iconMap: Record<ReviewFinalModule["icon"], LucideIcon> = {
  compass: Compass,
  languages: Languages,
  book: BookOpenCheck,
  target: Target,
  message: MessageSquareText,
  shield: ShieldCheck,
  sparkles: Sparkles,
};

export function ReviewFinalModuleSection({
  module,
}: {
  module: ReviewFinalModule;
}) {
  const Icon = iconMap[module.icon];

  return (
    <section
      id={module.id}
      className="scroll-mt-6 rounded-ds-24 border border-border-soft bg-surface/85 p-5 shadow-card max-sm:p-4 sm:p-6"
    >
      <SectionHeader
        eyebrow={module.eyebrow}
        title={module.title}
        description={module.description}
        action={
          <span className="flex size-11 items-center justify-center rounded-ds-16 bg-accent-gold text-background-primary shadow-premium">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        }
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <FeatureHighlight
          title="Para que serve"
          description={module.purpose}
          Icon={Compass}
          tone="premium"
        />
        <FeatureHighlight
          title="Quando usar"
          description={module.whenToUse}
          Icon={Target}
          tone="info"
        />
        <FeatureHighlight
          title="Por que merece atencao"
          description={module.whyItDeservesAttention}
          Icon={Sparkles}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-5">
        {module.units.map((unit) => (
          <article
            key={`${module.id}:${unit.title}`}
            className="rounded-ds-20 border border-border-soft bg-background-primary/46 p-5 max-sm:p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-3xl">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone="premium">Modulo guiado</StatusBadge>
                  <StatusBadge tone="info">Questao comentada</StatusBadge>
                </div>
                <h3 className="mt-4 text-heading-3 font-semibold text-text-primary">
                  {unit.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">
                  {unit.introduction}
                </p>
              </div>
              <span className="rounded-ds-12 border border-border-soft px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Revisao ativa
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <ContentCard
                title="Por que esse assunto merece atencao"
                description={unit.whyItMatters}
                Icon={Target}
                tone="premium"
              />
              <ContentCard
                title="Resumo da explicacao"
                description={unit.explanation.join(" ")}
                Icon={BookOpenCheck}
                tone="success"
              />
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <ContentCard
                title="Exemplos"
                tone="info"
                Icon={Languages}
                metadata={
                  <div className="grid gap-3">
                    {unit.examples.map((example) => (
                      <div
                        key={`${unit.title}:${example.label}`}
                        className="rounded-ds-12 border border-border-soft bg-surface/70 p-3"
                      >
                        <p className="text-caption font-semibold uppercase text-accent-gold">
                          {example.label}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-text-primary">
                          {example.content}
                        </p>
                        {example.translation ? (
                          <p className="mt-2 text-sm leading-6 text-text-muted">
                            {example.translation}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                }
              />

              <ContentCard
                title="Erros que mais confundem candidatos"
                tone="warning"
                Icon={AlertTriangle}
                metadata={
                  <div className="grid gap-2">
                    {unit.commonMistakes.map((mistake) => (
                      <div
                        key={`${unit.title}:${mistake}`}
                        className="rounded-ds-12 border border-warning/20 bg-warning/10 px-3 py-2 text-sm leading-6 text-text-primary"
                      >
                        {mistake}
                      </div>
                    ))}
                  </div>
                }
              />
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <ContentCard
                title="Dicas praticas"
                tone="success"
                Icon={Lightbulb}
                metadata={
                  <div className="grid gap-2">
                    {unit.practicalTips.map((tip) => (
                      <div
                        key={`${unit.title}:${tip}`}
                        className="rounded-ds-12 border border-border-soft bg-surface/70 px-3 py-2 text-sm leading-6 text-text-primary"
                      >
                        {tip}
                      </div>
                    ))}
                  </div>
                }
              />

              <FeatureHighlight
                title={unit.attention.title}
                description={unit.attention.description}
                Icon={AlertTriangle}
                tone="premium"
                metric="Atenção"
                className="h-full"
              />
            </div>

            <div className="mt-5 rounded-ds-16 border border-accent-gold/35 bg-accent-gold-soft p-4">
              <p className="text-caption font-semibold uppercase text-accent-gold">
                Resumo rapido
              </p>
              <p className="mt-3 text-sm leading-6 text-text-primary">
                {unit.quickSummary}
              </p>
            </div>

            <div className="mt-5 rounded-ds-16 border border-border-soft bg-surface/75 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <p className="text-caption font-semibold uppercase text-accent-gold">
                    Questao comentada
                  </p>
                  <h4 className="mt-3 text-lg font-semibold text-text-primary">
                    {unit.commentedQuestion.prompt}
                  </h4>
                  {unit.commentedQuestion.supportText ? (
                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      {unit.commentedQuestion.supportText}
                    </p>
                  ) : null}
                </div>
                <ListChecks className="size-5 shrink-0 text-accent-gold" aria-hidden="true" />
              </div>

              <div className="mt-4 grid gap-3">
                {unit.commentedQuestion.options.map((option) => (
                  <div
                    key={`${unit.title}:${option.label}`}
                    className={`rounded-ds-12 border p-3 ${
                      option.isCorrect
                        ? "border-success/35 bg-success/10"
                        : "border-border-soft bg-background-primary/65"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-7 items-center justify-center rounded-full border border-current/25 text-xs font-semibold text-text-primary">
                        {option.label}
                      </span>
                      <p className="text-sm font-semibold text-text-primary">
                        {option.text}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      {option.commentary}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-ds-12 border border-border-soft bg-background-primary/70 px-4 py-3">
                <p className="text-caption font-semibold uppercase text-accent-gold">
                  Fechamento da questao
                </p>
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {unit.commentedQuestion.takeaway}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
