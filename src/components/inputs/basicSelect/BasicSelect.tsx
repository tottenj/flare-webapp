"use client"
import Select from 'react-select';
import PrimaryLabel from '../labels/primaryLabel/PrimaryLabel';
import { useState } from 'react';

interface basicSelectProps {
  options: any[];
  label?: string;
  name: string;
  z?: string;
  multi?: boolean;
  defaultValue?: any | any[] | null;
}
export default function BasicSelect({ options, label, name, z ,multi = false, defaultValue}: basicSelectProps) {
  const [selected, setSelected] = useState<any | any[] | null>(defaultValue ?? (multi ? [] : null));


  return (
    <div className="flex w-full flex-col">
      <PrimaryLabel label={label} />
      <div className="relative z-50 overflow-visible">
        <Select
          name={name}
          options={options}
          value={selected}
          menuPosition="fixed"
          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9997 }),
          }}
          isMulti={multi}
          className={`${z}`}
          classNamePrefix="react-select"
          onChange={(opt) => setSelected(opt)}
        />
      </div>
      ;
    </div>
  );
}
