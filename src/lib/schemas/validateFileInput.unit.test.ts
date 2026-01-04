import validateFileInput from "@/lib/schemas/validateFileInput";
import {expect} from "@jest/globals"

describe('validateFileInput', () => {
  const makeFile = (type: string, size: number) => new File(['x'.repeat(size)], 'test', { type });

  it('rejects non-image files', () => {
    const file = makeFile('text/plain', 10);
    expect(validateFileInput({ file })).toBe('Only image files are allowed');
  });

  it('rejects images larger than max size', () => {
    const file = makeFile('image/png', 6 * 1024 * 1024);
    expect(validateFileInput({ file, options: { maxSize: 5 } })).toBe('Image must be under 5MB');
  });

  it('accepts valid image under default size limit', () => {
    const file = makeFile('image/jpeg', 1 * 1024 * 1024);
    expect(validateFileInput({ file })).toBeNull();
  });
});
