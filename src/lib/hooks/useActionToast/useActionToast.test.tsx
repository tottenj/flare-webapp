import { render, act } from '@testing-library/react';
import { useState, useEffect } from 'react';
import { useActionToast } from './useActionToast';
import { toast } from 'react-toastify';
import {expect} from "@jest/globals"


// Mock toast functions
jest.mock('react-toastify', () => ({
  toast: {
    loading: jest.fn(() => 'toast-id'),
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

const TestComponent = ({ state, pending }: { state: { message?: string }; pending: boolean }) => {
  useActionToast(state, pending, {
    successMessage: 'It worked!',
    loadingMessage: 'Hold on...',
  });
  return null;
};

describe('useActionToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading toast when pending', () => {
    render(<TestComponent state={{}} pending={true} />);
    expect(toast.loading).toHaveBeenCalledWith('Hold on...');
  });

  it('dismisses toast and shows success when operation succeeds', () => {
    const { rerender } = render(<TestComponent state={{}} pending={true} />);

    expect(toast.loading).toHaveBeenCalledWith('Hold on...');

    rerender(<TestComponent state={{ message: 'User created successfully' }} pending={false} />);

    expect(toast.dismiss).toHaveBeenCalledWith('toast-id');
    expect(toast.success).toHaveBeenCalledWith('It worked!');
  });

  it('dismisses toast and shows error when operation fails', () => {
    const { rerender } = render(<TestComponent state={{}} pending={true} />);

    rerender(<TestComponent state={{ message: 'Something went wrong' }} pending={false} />);

    expect(toast.dismiss).toHaveBeenCalledWith('toast-id');
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('does nothing if no message and not pending', () => {
    render(<TestComponent state={{}} pending={false} />);

    expect(toast.loading).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.dismiss).not.toHaveBeenCalled();
  });
});
