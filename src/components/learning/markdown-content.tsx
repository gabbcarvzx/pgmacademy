import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${part}-${index}`}
          className="rounded bg-background-secondary px-1.5 py-0.5 font-mono text-[0.9em] text-accent-gold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function flushList(items: string[], key: string, ordered = false) {
  if (items.length === 0) {
    return null;
  }

  const List = ordered ? "ol" : "ul";

  return (
    <List key={key} className="my-5 grid gap-2 pl-5 text-body leading-7 text-text-secondary">
      {items.map((item) => (
        <li key={item} className={ordered ? "list-decimal" : "list-disc"}>
          {renderInline(item)}
        </li>
      ))}
    </List>
  );
}

export function MarkdownContent({ content }: { content: string }) {
  const nodes: ReactNode[] = [];
  const lines = content.split(/\r?\n/);
  let listItems: string[] = [];
  let orderedListItems: string[] = [];

  const flushLists = (key: string) => {
    const unorderedList = flushList(listItems, `${key}-unordered`);
    const orderedList = flushList(orderedListItems, `${key}-ordered`, true);
    if (unorderedList) nodes.push(unorderedList);
    if (orderedList) nodes.push(orderedList);
    listItems = [];
    orderedListItems = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      flushLists(`list-${index}`);
      continue;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      orderedListItems.push(orderedMatch[1]);
      continue;
    }

    flushLists(`list-${index}`);

    if (line.startsWith("|")) {
      const tableRows: string[][] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        const tableLine = lines[index].trim();
        const cells = tableLine
          .slice(1, tableLine.endsWith("|") ? -1 : undefined)
          .split("|")
          .map((cell) => cell.trim());
        if (!cells.every((cell) => /^:?-{3,}:?$/.test(cell))) {
          tableRows.push(cells);
        }
        index += 1;
      }
      index -= 1;
      const [header, ...body] = tableRows;
      if (header) {
        nodes.push(
          <div key={`table-${index}`} className="my-6 overflow-x-auto rounded-ds-12 border border-border-soft">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="bg-background-secondary text-text-primary">
                <tr>
                  {header.map((cell, cellIndex) => (
                    <th key={`${cell}-${cellIndex}`} className="border-b border-border-soft px-4 py-3 font-semibold">
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, rowIndex) => (
                  <tr key={`${row.join("-")}-${rowIndex}`} className="border-b border-border-soft last:border-b-0">
                    {row.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`} className="px-4 py-3 align-top leading-6 text-text-secondary">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      continue;
    }

    if (line.startsWith("# ")) {
      if (nodes.length === 0) {
        continue;
      }

      nodes.push(
        <h1 key={`h1-${index}`} className="mb-6 mt-2 text-heading-1 font-semibold text-text-primary max-sm:text-3xl">
          {renderInline(line.slice(2))}
        </h1>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={`h2-${index}`} className="mb-3 mt-10 border-t border-border-soft pt-8 text-heading-2 font-semibold text-text-primary max-sm:text-2xl">
          {renderInline(line.slice(3))}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${index}`} className="mb-2 mt-7 text-heading-3 font-semibold text-text-primary max-sm:text-xl">
          {renderInline(line.slice(4))}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("> ")) {
      nodes.push(
        <blockquote key={`quote-${index}`} className="my-6 border-l-2 border-accent-gold bg-accent-gold-soft px-5 py-4 text-body leading-7 text-text-secondary">
          {renderInline(line.slice(2))}
        </blockquote>,
      );
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line)) {
      nodes.push(<hr key={`rule-${index}`} className="my-8 border-border-soft" />);
      continue;
    }

    nodes.push(
      <p key={`paragraph-${index}`} className="my-4 text-body leading-7 text-text-secondary">
        {renderInline(line)}
      </p>,
    );
  }

  flushLists("list-tail");

  return <div className="max-w-none overflow-hidden">{nodes}</div>;
}
