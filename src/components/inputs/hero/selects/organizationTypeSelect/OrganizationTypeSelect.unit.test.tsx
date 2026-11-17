import { fireEvent, render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import OrganizationTypeSelect from './OrganizationTypeSelect';
import { OrganizationTypeSchema } from '@/lib/schemas/org/OrganizationTypeSchema';
import { ORGANIZATION_TYPE_OPTIONS } from '@/lib/types/OrganizationType';

jest.mock('@heroui/react', () => {
  const Part = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
  const SelectRoot = ({
    children,
    onChange,
  }: {
    children: React.ReactNode;
    onChange: (value: string) => void;
  }) => (
    <div>
      {children}
      <button onClick={() => onChange('STUDENT_GROUP')}>Choose student group</button>
    </div>
  );
  const Item = ({ children }: { children: React.ReactNode }) => <div role="option">{children}</div>;

  return {
    Label: Part,
    Select: Object.assign(SelectRoot, {
      Trigger: Part,
      Value: Part,
      Indicator: Part,
      ClearButton: Part,
      Popover: Part,
    }),
    ListBox: Object.assign(Part, { Item, ItemIndicator: Part }),
  };
});

describe('OrganizationTypeSelect', () => {
  it('offers every valid organization type and reports the selection', () => {
    const onChange = jest.fn();
    render(<OrganizationTypeSelect onChange={onChange} />);

    for (const option of ORGANIZATION_TYPE_OPTIONS) {
      expect(screen.getByRole('option', { name: option.label })).toBeTruthy();
      expect(OrganizationTypeSchema.safeParse(option.value).success).toBe(true);
    }
    expect(ORGANIZATION_TYPE_OPTIONS).toHaveLength(9);
    fireEvent.click(screen.getByRole('button', { name: 'Choose student group' }));
    expect(onChange).toHaveBeenCalledWith('STUDENT_GROUP');
  });

  it('rejects obsolete or unknown types', () => {
    expect(OrganizationTypeSchema.safeParse('FOR_PROFIT').success).toBe(false);
    expect(OrganizationTypeSchema.safeParse('unknown').success).toBe(false);
  });
});
