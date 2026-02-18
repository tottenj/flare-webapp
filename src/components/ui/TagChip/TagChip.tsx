import { tagClasses } from '@/lib/types/TagColour';
import { getTagColor } from '@/lib/utils/ui/getTagColour';
import { Chip, ChipProps } from '@heroui/react';

interface tagChipProps extends ChipProps {
  label: string;
}

export default function TagChip({ label, ...props }: tagChipProps) {
  return (
    <Chip className={`capitalize ${tagClasses(getTagColor(label))}`} {...props}>
      {label}
    </Chip>
  );
}
