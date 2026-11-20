import { expect, it, describe } from '@jest/globals';
import submitOrgSignup from './submitOrgSignup';
function createValidFormData() {
  const formData = new FormData();
  formData.set('name', 'Community Group');
  formData.set('description', 'A local community group');
  formData.set('email', 'group@example.org');
  formData.set('phone', '555-0100');
  formData.set('website', 'https://example.org');
  formData.set('socialProofType', 'other');
  formData.set('socialProofDetails', 'Community newsletter');
  return formData;
}

describe('submitOrgSignup', () => {
  it('returns parsed values when the input is valid', async () => {
    const formData = createValidFormData();
    await expect(submitOrgSignup(formData)).resolves.toEqual({
      ok: true,
      data: null,
    });
  });

  it('returns field errors when the input is invalid', async () => {
    const formData = createValidFormData();
    formData.set('name', '');
    formData.set('email', 'not-an-email');
    const result = await submitOrgSignup(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_INPUT');
      expect(result.error.fieldErrors).toMatchObject({
        name: ['Organization name is required'],
        email: ['Invalid email address'],
      });
    }
  });
});
