"use client"
import React, { useState } from 'react';
import Select, { StylesConfig, components } from 'react-select';
import chroma from 'chroma-js';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import PrimaryLabel from '../labels/primaryLabel/PrimaryLabel';

export type ColourOption = {
  readonly value: string;
  readonly label: string;
  readonly color: string;
};

const colourStyles: StylesConfig<ColourOption> = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? color.alpha(0.2).css()
          : isFocused
            ? color.alpha(0.1).css()
            : undefined,
      color: '#000',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? color.alpha(0.3).css()
            : color.alpha(0.15).css()
          : undefined,
      },
    };
  },
  singleValue: (styles) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    color: '#000',
  }),
};

const Option = (props: any) => (
  <components.Option {...props}>
    <div className="flex items-center gap-2">
      <SVGLogo color={props.data.color} size={16} />
      {props.data.label}
    </div>
  </components.Option>
);

const SingleValue = (props: any) => (
  <components.SingleValue {...props}>
    <div className="flex items-center gap-2">
      <SVGLogo color={props.data.color} size={16} />
      {props.data.label}
    </div>
  </components.SingleValue>
);

const ColourSelect = ({
  options,
  label,
  name,
  z,
  multi = false,
  defaultValue
}: {
  options: ColourOption[];
  label?: string;
  name: string;
  z: string;
  multi?: boolean;
  defaultValue?: ColourOption | ColourOption[] | null
}) => {
  const [selected, setSelected] = useState<ColourOption | ColourOption[] | null>(defaultValue ?? (multi ? [] : null));


  return (
    <div className="flex w-full flex-col">
      <PrimaryLabel label={label} />
      <Select
        isMulti={multi}
        name={`${name}-select`} // prevent conflict
        value={selected}
        onChange={(opt) => setSelected(opt as ColourOption | ColourOption[])}
        options={options}
        styles={colourStyles}
        menuPosition="fixed"
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        classNamePrefix="colour-select"
        className={`${z}`}
        components={{ SingleValue, Option }}
      />
    </div>
  );
};

export default ColourSelect;
