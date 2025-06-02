'use client';

import BasicSelect from '@/components/inputs/basicSelect/BasicSelect';
import ColourSelect from '@/components/inputs/colourSelect/ColourSelect';
import { ageGroupOptions } from '@/lib/enums/AgeGroup';
import { colourOptions } from '@/lib/enums/eventType';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterForm({ close }: { close: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const ageParam = searchParams.get('age');
  const defaultTypes = typeParam ? typeParam.split(',') : [];
  const defaultAges = ageParam ? ageParam.split(',') : [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedTypes = formData.getAll('type-select') as string[];
    const ageRange = formData.getAll('ageRange') as string[];
    const params = new URLSearchParams(searchParams.toString());
    params.delete('type');

    if (selectedTypes.length > 0) {
      params.set('type', selectedTypes.join(','));
    } else {
      params.delete('type');
    }

    if (ageRange.length > 0) {
      params.set('age', ageRange.join(','));
    } else {
      params.delete('age');
    }

    router.push('?' + params.toString());
    close();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-center">
      <h1 className="mb-4 text-xl font-semibold">Filter Events</h1>
      <ColourSelect
        multi={true}
        z={'z-40'}
        label="Event Type"
        options={colourOptions}
        name="type"
        defaultValue={colourOptions.filter((opt) => defaultTypes.includes(opt.value))}
      />
      <BasicSelect
        multi={true}
        label="Age Range"
        options={ageGroupOptions}
        name="ageRange"
        defaultValue={ageGroupOptions.filter((opt) => defaultAges.includes(opt.value))}
      />

      <button
        type="submit"
        className="bg-primary hover:bg-primary-dark mt-4 rounded px-4 py-2 text-white"
      >
        Apply Filters
      </button>
    </form>
  );
}
