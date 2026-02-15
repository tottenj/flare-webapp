import AutoCompleteContainer from '@/components/inputs/hero/autocomplete/AutocompleteContainer';
import getAutoCompleteTags from '@/lib/serverActions/getAutocompleteTags/getAutoCompleteTags';

export default function TagAutoComplete() {
  return <AutoCompleteContainer label="Add Tags" name="tags" loadFunc={getAutoCompleteTags} allowsCustomValue />;
}
