import AutoCompleteContainer from '@/components/inputs/hero/autocomplete/AutocompleteContainer';
import getAutoCompleteTags from '@/lib/serverActions/getAutocompleteTags/getAutoCompleteTags';

export default function TagAutoComplete({maxNum = 5}: {maxNum?: number}) {
  return <AutoCompleteContainer description={`Maximum ${maxNum} tags allowed`} maxNum={maxNum} label="Add Tags" name="tags" loadFunc={getAutoCompleteTags} allowsCustomValue />;
}
