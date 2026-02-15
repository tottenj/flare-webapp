// lib/ui/tagColors.ts
export const TAG_COLORS = ['pink', 'purple', 'blue', 'teal', 'yellow', 'orange'] as const;

export type TagColor = (typeof TAG_COLORS)[number];

const TAG_CLASS_MAP: Record<TagColor, string> = {
  pink: `
    !bg-[hsl(var(--app-tag-pink))]
    !text-[var(--app-tag-pink-fg)]
  `,
  purple: `
    !bg-[hsl(var(--app-tag-purple))]
    !text-[var(--app-tag-purple-fg)]
  `,
  blue: `
    !bg-[hsl(var(--app-tag-blue))]
    !text-[var(--app-tag-blue-fg)]
  `,
  teal: `
    !bg-[hsl(var(--app-tag-teal))]
    !text-[var(--app-tag-teal-fg)]
  `,
  yellow: `
    !bg-[hsl(var(--app-tag-yellow))]
    !text-[var(--app-tag-yellow-fg)]
  `,
  orange: `
    !bg-[hsl(var(--app-tag-orange))]
    !text-[var(--app-tag-orange-fg)]
  `,
};

export function tagClasses(color: TagColor) {
  return TAG_CLASS_MAP[color];
}

export function tagColorValue(color: TagColor, variant: 'bg' | 'fg' | 'accent' = 'accent') {
  return `var(--app-tag-${color}-${variant})`;
}