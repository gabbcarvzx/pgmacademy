function flushList(items: string[], key: string) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul key={key} className="my-4 grid gap-2 pl-5 text-sm leading-7 text-muted">
      {items.map((item) => (
        <li key={item} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function MarkdownContent({ content }: { content: string }) {
  const nodes = [];
  let listItems: string[] = [];

  for (const [index, rawLine] of content.split(/\r?\n/).entries()) {
    const line = rawLine.trim();

    if (!line) {
      const list = flushList(listItems, `list-${index}`);
      if (list) nodes.push(list);
      listItems = [];
      continue;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }

    const list = flushList(listItems, `list-${index}`);
    if (list) nodes.push(list);
    listItems = [];

    if (/^\d+\.\s/.test(line)) {
      nodes.push(
        <p key={line} className="my-3 text-sm leading-7 text-muted">
          {line}
        </p>,
      );
      continue;
    }

    if (line.endsWith(":") || line.startsWith("Objetivo")) {
      nodes.push(
        <h2 key={line} className="mt-7 text-lg font-semibold text-white">
          {line}
        </h2>,
      );
      continue;
    }

    nodes.push(
      <p key={line} className="my-3 text-sm leading-7 text-muted">
        {line}
      </p>,
    );
  }

  const tailList = flushList(listItems, "list-tail");
  if (tailList) nodes.push(tailList);

  return <div className="max-w-none">{nodes}</div>;
}
