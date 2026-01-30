import AutoCompleteContainer from '@/components/inputs/autocomplete/AutocompleteContainer';
import getAutoCompleteTags from '@/lib/serverActions/getAutocompleteTags/getAutoCompleteTags';

export default function TagAutoComplete() {
  return <AutoCompleteContainer name="tags" loadFunc={getAutoCompleteTags} />;
}
