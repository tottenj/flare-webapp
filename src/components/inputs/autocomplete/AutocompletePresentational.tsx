import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@heroui/react';
import { AsyncListData } from '@react-stately/data';
import { AutoCompleteItem } from './AutocompleteContainer';

interface AutoCompletePresentationalProps
  extends Omit<AutocompleteProps<AutoCompleteItem>, 'items' | 'children' | 'list'> {
  list: AsyncListData<AutoCompleteItem>;
}

export default function AutoCompletePresentational({
  list,
  ...props
}: AutoCompletePresentationalProps) {
  return (
    <Autocomplete
      {...props}
      items={list.items}
      inputValue={list.filterText}
      onInputChange={list.setFilterText}
      isLoading={list.isLoading}
      errorMessage={list.error?.message}
      classNames={{
        base: 'rounded-none',
        popoverContent: 'rounded-sm',
        listboxWrapper: 'rounded-none',
        listbox: 'rounded-none',
      }}
    >
      {(item) => (
        <AutocompleteItem
          key={item.key}
          textValue={item.label}
          className="capitalize"
          description={item.description}
        >
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
