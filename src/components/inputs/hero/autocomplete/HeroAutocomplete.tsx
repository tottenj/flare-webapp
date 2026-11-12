import { Autocomplete, EmptyState, Label, ListBox, SearchField, Spinner } from '@heroui/react';
import type { ReactNode } from 'react';

import HeroDescription from '@/components/inputs/hero/description/HeroDescription';

export type HeroAutocompleteOption = {
  id: string;
  label: string;
};

export type HeroAutocompleteProps = {
  label?: string;
  name?: string;
  placeholder?: string;
  description?: ReactNode;
  searchValue: string;
  selectedKey: string | null;
  options: HeroAutocompleteOption[];
  required?: boolean;
  isLoading?: boolean;
  onSearchValueChange: (value: string) => void;
  onSelectionChange: (key: string | null) => void;
};

export default function HeroAutocomplete({
  label = 'Select Location',
  name,
  placeholder = 'Type to search...',
  description,
  searchValue,
  selectedKey,
  options,
  required = false,
  isLoading = false,
  onSearchValueChange,
  onSelectionChange,
}: HeroAutocompleteProps) {
  return (
    <Autocomplete
      allowsEmptyCollection
      className="w-full"
      fullWidth
      isRequired={required}
      name={selectedKey == null ? undefined : name}
      placeholder={label}
      selectionMode="single"
      value={selectedKey}
      variant="secondary"
      onChange={(key) => {
        const selected = Array.isArray(key) ? key[0] : key;
        onSelectionChange(selected == null ? null : String(selected));
      }}
    >
      <Label>{label}</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter inputValue={searchValue} onInputChange={onSearchValueChange}>
          <SearchField autoFocus aria-label={`Search ${label.toLowerCase()}`} variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input data-cy="location-input" placeholder={placeholder} />
              {isLoading ? <Spinner size="sm" /> : <SearchField.ClearButton />}
            </SearchField.Group>
          </SearchField>
          <ListBox
            className="max-h-60 overflow-y-auto"
            items={options}
            renderEmptyState={() => (
              <EmptyState>{isLoading ? 'Searching...' : 'No locations found'}</EmptyState>
            )}
          >
            {(option: HeroAutocompleteOption) => (
              <ListBox.Item id={option.id} textValue={option.label}>
                {option.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
      {description != null && <HeroDescription>{description}</HeroDescription>}
    </Autocomplete>
  );
}
