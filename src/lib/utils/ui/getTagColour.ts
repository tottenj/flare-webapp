import { TAG_COLORS, TagColor } from "@/lib/types/TagColour";

export function getTagColor(tagKey: string): TagColor {
  let hash = 0;

  for (let i = 0; i < tagKey.length; i++) {
    hash = (hash + tagKey.charCodeAt(i)) % TAG_COLORS.length;
  }

  return TAG_COLORS[hash];
}
