import { expect } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import type { ComponentProps } from 'react';

import HeroButton from './HeroButton';

jest.mock('@heroui/react', () => ({
  Button: ({
    variant,
    isDisabled,
    onPress,
    ...props
  }: ComponentProps<'button'> & {
    variant?: string;
    isDisabled?: boolean;
    onPress?: () => void;
  }) => <button {...props} data-variant={variant} disabled={isDisabled} onClick={onPress} />,
}));

describe('HeroButton', () => {
  it('forwards HeroUI props, children, and press handlers', () => {
    const onPress = jest.fn();
    render(
      <HeroButton variant="danger" type="submit" data-cy="delete-button" onPress={onPress}>
        Delete
      </HeroButton>
    );

    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveAttribute('data-variant', 'danger');
    expect(button).toHaveAttribute('data-cy', 'delete-button');
    expect(button).toHaveAttribute('type', 'submit');
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('forwards the disabled state', () => {
    render(<HeroButton isDisabled>Cancel</HeroButton>);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });
});
