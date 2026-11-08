import { AsyncListData } from '@react-stately/data';
import { AutoCompleteItem } from './AutocompleteContainer';
import type { ChangeEvent } from 'react';

interface AutoCompletePresentationalProps {
  list: AsyncListData<AutoCompleteItem>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  allowsCustomValue?: boolean;
  onSelectionChange?: (key: string) => void;
}

export default function AutoCompletePresentational({
  list,
  label,
  description,
  onSelectionChange,
  ...props
}: AutoCompletePresentationalProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    list.setFilterText(value);
    const selected = list.items.find((item) => item.label === value);
    if (selected) onSelectionChange?.(selected.key);
  };

  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      {label && <span>{label}</span>}
      <input
        type="text"
        list="tag-autocomplete-options"
        value={list.filterText}
        onChange={handleChange}
        disabled={props.disabled}
        required={props.required}
        placeholder={props.placeholder}
        className="min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2"
      />
      <datalist id="tag-autocomplete-options">
        {list.items.map((item) => (
          <option key={item.key} value={item.label}>
            {item.description}
          </option>
        ))}
      </datalist>
      {description && <span className="text-sm text-neutral-600">{description}</span>}
      {list.error?.message && <span className="text-sm text-red-700">{list.error.message}</span>}
    </label>
  );
}
