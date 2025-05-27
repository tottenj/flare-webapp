import { Label } from '@headlessui/react';
import Select from 'react-select';
import PrimaryLabel from '../labels/primaryLabel/PrimaryLabel';

interface basicSelectProps {
  options: any[];
  label?: string;
  name: string
  z?:string
}
export default function BasicSelect({ options, label, name, z }: basicSelectProps) {
  return (
    <div className='flex flex-col'>
      <PrimaryLabel label={label} />
      <div className="relative z-50 overflow-visible">
        <Select
          name={name}
          options={options}
          defaultValue={options[0]}
          menuPosition="fixed"
          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9997 }),
          }}
          className={`${z}`}
          classNamePrefix="react-select"
        />
      </div>
      ;
    </div>
  );
}
