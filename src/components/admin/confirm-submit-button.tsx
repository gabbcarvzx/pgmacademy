"use client";

export function ConfirmSubmitButton({
  children,
  message,
}: {
  children: string;
  message: string;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className="h-10 w-full rounded-md border border-pgm-red/40 text-sm font-semibold text-pgm-red transition hover:bg-pgm-red/10"
    >
      {children}
    </button>
  );
}
