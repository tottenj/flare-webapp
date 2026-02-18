'use server';

import { AutoCompleteItem } from '@/components/inputs/hero/autocomplete/AutocompleteContainer';
import z from 'zod';

export default async function getAutoCompleteTags(query: string): Promise<AutoCompleteItem[]> {
  const sanitized = z.string().min(2).safeParse(query);
  if (!sanitized.success) return [];

  return [{ key: 'key', label: 'label' }];
}
