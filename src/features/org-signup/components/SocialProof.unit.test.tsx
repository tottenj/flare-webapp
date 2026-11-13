import { expect } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import type { ComponentProps, ReactNode } from 'react';

import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import SocialProof from './SocialProof';

jest.mock('@heroui/react', () => ({
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
    <div data-name={name} data-required={isRequired} data-invalid={isInvalid}>
      {children}
    </div>
  ),
  TextArea: ({ fullWidth, ...props }: ComponentProps<'textarea'> & { fullWidth?: boolean }) => (
    <textarea {...props} />
  ),
  Input: ({ fullWidth, ...props }: ComponentProps<'input'> & { fullWidth?: boolean }) => (
    <input {...props} />
  ),
  Label: (props: ComponentProps<'label'>) => <label {...props} />,
  Description: (props: ComponentProps<'p'>) => <p {...props} />,
  FieldError: (props: ComponentProps<'p'>) => <p {...props} />,
}));

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
  it('forwards the native file change and renders the configured handle', () => {
    const onChange = jest.fn();
    render(<SocialProof platform="instagram" onChange={onChange} />);

    expect(screen.getByText('Instagram Handle')).toBeInTheDocument();
    expect(screen.getByRole('textbox').parentElement).toHaveAttribute('data-name', 'instagram');

    const input = screen.getByLabelText('Instagram Proof') as HTMLInputElement;
    const file = new File(['proof'], 'proof.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('name', 'instagram-file');
    expect(input.files?.[0]).toBe(file);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
