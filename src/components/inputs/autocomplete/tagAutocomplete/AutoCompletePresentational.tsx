import { AutoCompleteItem } from '@/components/inputs/autocomplete/tagAutocomplete/TagAutoCompleteContainer';
import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@heroui/react';
import { AsyncListData } from '@react-stately/data';

interface AutocompletePresentationalProps
  extends Omit<AutocompleteProps<AutoCompleteItem>, 'items' | 'children' | 'inputValue' | 'list'> {
  list: AsyncListData<AutoCompleteItem>;
}

export default function AutoCompletePresentational({
  list,
  ...autocompleteProps
}: AutocompletePresentationalProps) {
  return (
    <Autocomplete
      allowsCustomValue
      multiple
      {...autocompleteProps}
      items={list.items}
      inputValue={list.filterText}
      onInputChange={list.setFilterText}
      isLoading={list.isLoading}
      classNames={{
        base: 'rounded-none',
        popoverContent: 'rounded-sm',
        listboxWrapper: 'rounded-none',
        listbox: 'rounded-none',
      }}
    >
      {(item) => (
        <AutocompleteItem className="capitalize" description={item.description} key={item.key}>
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
