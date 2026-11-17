import { expect } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import type { ComponentProps, ReactNode } from 'react';

import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import { orgSocialProofSchema } from '../schemas/orgCreateSchema';
import OrganizationForm from './OrganizationForm';
import SocialProof from './SocialProof';

jest.mock('@/components/inputs/placeSearch/PlaceSearch', () => () => null);
jest.mock('@/components/ui/HeroProgressBar/HeroProgressBar', () => () => null);
jest.mock('@/components/ui/HeroCard/HeroCard', () => ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
));
jest.mock('@/components/forms/hero/form/HeroForm', () => (props: ComponentProps<'form'>) => (
  <form {...props} />
));
jest.mock('@/components/forms/hero/fieldset/HeroFieldset', () => {
  const Container = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  return Object.assign(Container, { Group: Container, Actions: Container });
});
jest.mock(
  '@/components/buttons/heroButton/HeroButton',
  () =>
    ({ children, onPress, ...props }: ComponentProps<'button'> & { onPress?: () => void }) => (
      <button {...props} onClick={onPress}>
        {children}
      </button>
    )
);

jest.mock('@heroui/react', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const SelectContext = React.createContext<(value: string) => void>(() => {});
  const FieldNameContext = React.createContext<string | undefined>(undefined);

  return {
    Select: Object.assign(
      ({
        children,
        onChange,
        name,
        value,
      }: {
        children: ReactNode;
        onChange: (value: string) => void;
        name: string;
        value: string;
      }) => (
        <SelectContext.Provider value={onChange}>
          <input type="hidden" name={name} value={value} />
          {children}
        </SelectContext.Provider>
      ),
      {
        Trigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
        Value: () => null,
        Indicator: () => null,
        Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
      }
    ),
    ListBox: Object.assign(({ children }: { children: ReactNode }) => <div>{children}</div>, {
      Item: ({ children, id }: { children: ReactNode; id: string }) => {
        const onChange = React.useContext(SelectContext);
        return (
          <button type="button" onClick={() => onChange(id)}>
            {children}
          </button>
        );
      },
      ItemIndicator: () => null,
    }),
    TextField: ({
      children,
      name,
      isRequired,
      isInvalid,
    }: {
      children: ReactNode;
      name?: string;
      isRequired?: boolean;
      isInvalid?: boolean;
    }) => (
      <FieldNameContext.Provider value={name}>
        <div data-name={name} data-required={isRequired} data-invalid={isInvalid}>
          {children}
        </div>
      </FieldNameContext.Provider>
    ),
    TextArea: ({ fullWidth, ...props }: ComponentProps<'textarea'> & { fullWidth?: boolean }) => (
      <textarea {...props} />
    ),
    Input: ({ fullWidth, name, ...props }: ComponentProps<'input'> & { fullWidth?: boolean }) => {
      const fieldName = React.useContext(FieldNameContext);
      return <input {...props} name={name ?? fieldName} />;
    },
    Label: (props: ComponentProps<'label'>) => <label {...props} />,
    Description: (props: ComponentProps<'p'>) => <p {...props} />,
    FieldError: (props: ComponentProps<'p'>) => <p {...props} />,
  };
});

describe('HeroTextArea', () => {
  it('forwards native props and validation state', () => {
    render(
      <HeroTextArea
        label="Description"
        name="description"
        rows={4}
        required
        errorMessage="Required"
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '4');
    expect(textarea.parentElement).toHaveAttribute('data-name', 'description');
    expect(textarea.parentElement).toHaveAttribute('data-required', 'true');
    expect(textarea.parentElement).toHaveAttribute('data-invalid', 'true');
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});

describe('SocialProof', () => {
  it('switches proof types and forwards the selected file', () => {
    const onChange = jest.fn();
    render(<SocialProof onChange={onChange} />);

    expect(screen.getByText('Twitter / X Handle')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Instagram' }));
    expect(screen.getByText('Instagram Handle')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '@yourorg');
    fireEvent.click(screen.getByRole('button', { name: 'Facebook' }));
    expect(screen.getByText('Facebook Handle')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'facebook.com/yourorg');
    fireEvent.click(screen.getByRole('button', { name: 'Other' }));
    expect(screen.getByText('Proof description')).toBeInTheDocument();
    expect(screen.getByRole('textbox').parentElement).toHaveAttribute(
      'data-name',
      'socialProofDetails'
    );

    const input = screen.getByLabelText('Proof file') as HTMLInputElement;
    const file = new File(['proof'], 'proof.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('name', 'socialProofFile');
    expect(input.files?.[0]).toBe(file);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('validates proof on submit and preserves it when navigating steps', () => {
    render(<OrganizationForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Other' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('Enter a link, handle, or explanation')).toBeInTheDocument();

    const details = within(screen.getByText('Proof description').parentElement!).getByRole(
      'textbox'
    );
    fireEvent.change(details, { target: { value: 'Community newsletter' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.queryByText('Enter a link, handle, or explanation')).not.toBeInTheDocument();

    const input = screen.getByLabelText('Proof file') as HTMLInputElement;
    const file = new File(['proof'], 'proof.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Proof description')).toBeInTheDocument();
    expect(details).toHaveValue('Community newsletter');
    expect(input.files?.[0]).toBe(file);
    expect(
      orgSocialProofSchema.safeParse({
        socialProofType: 'other',
        socialProofDetails: 'Community newsletter',
        socialProofFile: file,
      }).success
    ).toBe(true);
  });
});
