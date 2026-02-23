import { AutoCompleteItem } from "@/components/inputs/hero/autocomplete/AutocompleteContainer";

export default async function getAutoCompleteTags(query: string): Promise<AutoCompleteItem[]> {
  return [{ key: 'key', label: 'label' }];
}
