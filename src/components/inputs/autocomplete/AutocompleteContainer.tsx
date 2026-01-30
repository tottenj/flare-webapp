'use client';
import { useAsyncList } from '@react-stately/data';
import AutoCompletePresentational from '@/components/inputs/autocomplete/AutocompletePresentational';
import { useMemo, useState } from 'react';
import { AutocompleteProps, Button, Chip } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export type AutoCompleteItem = {
  key: string;
  label: string;
  description?: string;
};

interface TagAutoCompleteContainerProps
  extends Omit<
    AutocompleteProps<AutoCompleteItem>,
    'selectedKey' | 'onSelectionChange' | 'list' | 'children'
  > {
  loadFunc: (filterText: string) => Promise<AutoCompleteItem[]>;
  withChips?: boolean;
  name?: string;
  maxNum?: number;
}

export default function AutoCompleteContainer({
  loadFunc,
  withChips = true,
  name,
  maxNum,
  ...props
}: TagAutoCompleteContainerProps) {
  const [selectedTags, setSelectedTags] = useState<Map<string, string>>(new Map());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const list = useAsyncList<AutoCompleteItem>({
    async load({ filterText }) {
      return { items: await loadFunc(filterText ?? '') };
    },
  });

  const labelByKey = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of list.items) map.set(item.key, item.label);
    return map;
  }, [list.items]);

  const onSelectionChange = (key: React.Key | null) => {
    if (!key) return;
    const strKey = String(key);
    const label = labelByKey.get(strKey) ?? strKey;

    setSelectedKey(strKey);
    addTag(strKey);
    if (!withChips) {
      setInputValue(label);
    }
  };

  const onClose = (key: string) => {
    if (!key) return;
    setSelectedTags((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const addTag = (raw: string) => {
    if (maxNum && selectedTags.size >= maxNum) return;
    const parsed = raw.trim();
    if (!parsed) return;
    const label = labelByKey.get(parsed) ?? parsed;
    setSelectedTags((prev) => {
      const next = new Map(prev);
      next.set(parsed, label);
      return next;
    });

    if (withChips) {
      setSelectedKey(null);
      setInputValue('');
      list.setFilterText('');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex gap-2">
        <AutoCompletePresentational
          {...props}
          disabled={Boolean(maxNum && selectedTags.size >= maxNum)}
          selectedKey={selectedKey}
          onSelectionChange={onSelectionChange}
          list={list}
        />
        {name && (
          <input type="hidden" name={name} value={JSON.stringify([...selectedTags.keys()])}></input>
        )}
        {props.allowsCustomValue && (
          <Button className="hover:bg-success" onPress={() => addTag(list.filterText)}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        )}
      </div>
      {withChips && (
        <div className="flex gap-4">
          {[...selectedTags.entries()].map(([key, label]) => (
            <Chip onClose={() => onClose(key)} className="capitalize" key={key}>
              {label}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
