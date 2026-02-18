// stories/mocks/fakeAutoCompleteList.ts
import { AutoCompleteItem } from '@/components/inputs/hero/autocomplete/AutocompleteContainer';
import type { AsyncListData } from '@react-stately/data';


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
