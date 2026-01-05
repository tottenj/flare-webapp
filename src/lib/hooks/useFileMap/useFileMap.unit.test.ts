import useFileMap from '@/lib/hooks/useFileMap/useFileMap';
import { renderHook, act } from '@testing-library/react';
import { expect } from '@jest/globals';
import { toast } from 'react-toastify';
import { ClientError } from '@/lib/errors/clientErrors/ClientError';

const file = new File(['img'], 'avatar.jpg', { type: 'image/jpeg' });

describe('useFileMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploads file and updates state on success', async () => {
    const onFileChange = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useFileMap({
        initial: { avatar: null },
        onFileChange,
      })
    );

    await act(async () => {
      await result.current.setFile('avatar', file);
    });

    expect(toast.info).toHaveBeenCalledWith('Uploading File');
    expect(onFileChange).toHaveBeenCalledWith('avatar', file);
    expect(result.current.files.avatar).toBe(file);
    expect(result.current.isBusy).toBe(false);
    expect(toast.success).toHaveBeenCalledWith('Successfully Uploaded File');
  });

  it('returns early if no file', async () => {
    const onFileChange = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useFileMap({
        initial: { avatar: null },
        onFileChange,
      })
    );
    await act(async () => {
      await result.current.setFile('avatar', null);
    });

    expect(onFileChange).not.toHaveBeenCalled();
    expect(result.current.files.avatar).toBeNull();
    expect(result.current.isBusy).toBe(false);
  });

  it('handles ClientError with specific message', async () => {
    const error = new ClientError('SESSION_EXPIRED', 'Session expired');

    const onFileChange = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() =>
      useFileMap({
        initial: { avatar: null },
        onFileChange,
      })
    );

    await act(async () => {
      await result.current.setFile('avatar', file);
    });

    expect(toast.error).toHaveBeenCalledWith('Session expired');
    expect(result.current.files.avatar).toBeNull();
    expect(result.current.isBusy).toBe(false);
  });

  it('handles unknown errors with specific message', async () => {
    const error = new Error("Thrown Error")
    const onFileChange = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() =>
      useFileMap({
        initial: { avatar: null },
        onFileChange,
      })
    );

    await act(async () => {
      await result.current.setFile('avatar', file);
    });

    expect(toast.error).toHaveBeenCalledWith('Sorry Something Went Wrong Please Try Again Later');
    expect(result.current.files.avatar).toBeNull()
    expect(result.current.isBusy).toBe(false)
  });

  it('clear() resets files to initial state', () => {
    const { result } = renderHook(() =>
      useFileMap({
        initial: { avatar: file },
      })
    );

    act(() => {
      result.current.clear();
    });

    expect(result.current.files.avatar).toBe(file);
  });
});
