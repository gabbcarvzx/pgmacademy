type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="inline-flex rounded-md border border-pgm-yellow/30 bg-pgm-yellow/10 px-3 py-1.5 text-sm font-semibold text-pgm-yellow">
        {eyebrow}
      </p>
      <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
        {description}
      </p>
    </div>
  );
}
