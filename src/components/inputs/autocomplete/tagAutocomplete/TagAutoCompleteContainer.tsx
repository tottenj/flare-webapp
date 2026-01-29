'use client';
import getAutoCompleteTags from '@/lib/serverActions/getAutocompleteTags/getAutoCompleteTags';
import { useAsyncList } from '@react-stately/data';
import AutoCompletePresentational from '@/components/inputs/autocomplete/tagAutocomplete/AutoCompletePresentational';

export type AutoCompleteItem = {
  key: string;
  label: string;
  description?: string;
};

export default function TagAutoCompleteContainer() {
  const list = useAsyncList<AutoCompleteItem>({
    async load({ filterText }) {
      const items = await getAutoCompleteTags(filterText ?? '');
      return { items };
    },
  });

  return <AutoCompletePresentational list={list} />;
}
