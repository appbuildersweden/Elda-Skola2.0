import type { ReactNode } from "react";

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbers"; items: string[] };

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${index++}`;

    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-card px-1 py-0.5 text-[12px] text-ink"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let bullets: string[] = [];
  let numbers: string[] = [];

  const flush = () => {
    if (bullets.length > 0) {
      blocks.push({ type: "bullets", items: bullets });
      bullets = [];
    }
    if (numbers.length > 0) {
      blocks.push({ type: "numbers", items: numbers });
      numbers = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line.length === 0) {
      flush();
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      flush();
      blocks.push({ type: "heading", text: line.replace(/^#{1,6}\s+/, "") });
      continue;
    }

    if (/^[-*•]\s+/.test(line)) {
      if (numbers.length > 0) flush();
      bullets.push(line.replace(/^[-*•]\s+/, ""));
      continue;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      if (bullets.length > 0) flush();
      numbers.push(line.replace(/^\d+[.)]\s+/, ""));
      continue;
    }

    flush();
    blocks.push({ type: "paragraph", text: line });
  }

  flush();
  return blocks;
}

export default function RichText({ text }: { text: string }) {
  const blocks = toBlocks(text);

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <p
              key={index}
              className="pt-1 text-[13px] font-semibold text-ink first:pt-0"
            >
              {inline(block.text, `h-${index}`)}
            </p>
          );
        }

        if (block.type === "bullets") {
          return (
            <ul key={index} className="space-y-1 pl-0.5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-2">
                  <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-accent" />
                  <span>{inline(item, `b-${index}-${itemIndex}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "numbers") {
          return (
            <ol key={index} className="space-y-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-2">
                  <span
                    aria-hidden
                    className="mt-px shrink-0 text-[11.5px] font-medium text-accent tabular-nums"
                  >
                    {itemIndex + 1}.
                  </span>
                  <span>{inline(item, `n-${index}-${itemIndex}`)}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className="leading-[1.6]">
            {inline(block.text, `p-${index}`)}
          </p>
        );
      })}
    </div>
  );
}
