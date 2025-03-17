import { Operation } from "@echoai/shared";

interface Range {
  start: number;
  end: number;
}

export function parse(text: string): Operation[] {
  const result: Operation[] = [];
  const excludedRanges: Range[] = [];

  // First handle start-end pairs
  const startEndPattern = /\$\$start:([a-zA-Z0-9-]+)([^$]*)\$\$(.*?)\$\$end:\1\$\$/gs;
  let startEndMatch;

  while ((startEndMatch = startEndPattern.exec(text)) !== null) {
    const [fullMatch, type, propsStr, content] = startEndMatch;
    const matchStart = startEndMatch.index;
    const matchEnd = matchStart + fullMatch.length;

    result.push({
      type: type as Operation['type'],
      ...(parseProps(propsStr) as any),
      content: content.trim()
    });

    // Mark this range as excluded for single tags
    excludedRanges.push({
      start: matchStart,
      end: matchEnd
    });
  }

  // Then handle single tags, excluding any start: or end: tags
  const singlePattern = /\$\$(?!start:)(?!end:)([a-zA-Z0-9-]+)([^$]*)\$\$/g;
  let singleMatch;

  while ((singleMatch = singlePattern.exec(text)) !== null) {
    const [fullMatch, type, propsStr] = singleMatch;
    const matchStart = singleMatch.index;
    const matchEnd = matchStart + fullMatch.length;

    // Skip if this tag is within any excluded range
    const isExcluded = excludedRanges.some(range =>
      matchStart >= range.start && matchEnd <= range.end
    );

    if (!isExcluded) {
      result.push({
        type: type as Operation['type'],
        ...(parseProps(propsStr) as any),
      });
    }
  }

  return result;
}

function parseProps(propsString: string): Record<string, string> {
  const props: Record<string, string> = {};
  const pattern = /(\w+)="([^"]*)"/g;

  let match;
  while ((match = pattern.exec(propsString)) !== null) {
    const [, key, value] = match;
    props[key] = value;
  }

  return props;
}
