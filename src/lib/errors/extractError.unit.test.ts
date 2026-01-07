import z from 'zod';
import { extractFieldErrors } from './extractError';
import {expect} from "@jest/globals"

describe('extractFieldErrors', () => {
  it('returns empty object when tree has no properties', () => {
    const schema = z.string();
    const result = schema.safeParse(123);

    if (result.success) throw new Error('Expected failure');

    const tree = z.treeifyError(result.error);
    const fieldErrors = extractFieldErrors(tree);

    expect(fieldErrors).toEqual({});
  });

  it('extracts field errors from object schema', () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    const result = schema.safeParse({
      email: 'not-an-email',
      password: '123',
    });

    if (result.success) throw new Error('Expected failure');

    const tree = z.treeifyError(result.error);
    const fieldErrors = extractFieldErrors(tree);

    expect(fieldErrors).toEqual({
      email: expect.arrayContaining([expect.any(String)]),
      password: expect.arrayContaining([expect.any(String)]),
    });
  });

  it('ignores fields without errors', () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    const result = schema.safeParse({
      email: 'test@example.com',
      password: '123',
    });

    if (result.success) throw new Error('Expected failure');

    const tree = z.treeifyError(result.error);
    const fieldErrors = extractFieldErrors(tree);

    expect(fieldErrors).toEqual({
      password: expect.any(Array),
    });
  });
});
