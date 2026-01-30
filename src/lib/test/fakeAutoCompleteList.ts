// stories/mocks/fakeAutoCompleteList.ts
import type { AsyncListData } from '@react-stately/data';
import type { AutoCompleteItem } from '@/components/inputs/autocomplete/AutocompleteContainer';

export function createFakeAsyncList(items: AutoCompleteItem[]): AsyncListData<AutoCompleteItem> {
  return {
    items,
    filterText: '',
    isLoading: false,
    setFilterText: () => {},
    reload: async () => {},
    loadMore: () => {},
    sort: () => {},
    selectedKeys: new Set(),
    setSelectedKeys: () => {},
  } as unknown as AsyncListData<AutoCompleteItem>;
}
