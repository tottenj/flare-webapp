import isUsersAccount from './isUsersAccount';
import { expect } from '@jest/globals';

describe('isUsersAccount', () => {
  it('returns true when source and target IDs match', () => {
    expect(isUsersAccount('uid-123', 'uid-123')).toBe(true);
  });

  it('returns false when source and target IDs differ', () => {
    expect(isUsersAccount('uid-123', 'uid-124')).toBe(false);
  });

  it('returns false when one of the values is empty', () => {
    expect(isUsersAccount('', 'uid-123')).toBe(false);
    expect(isUsersAccount('uid-123', '')).toBe(false);
  });

  it('returns false when both values are empty', () => {
    expect(isUsersAccount('', '')).toBe(false);
  });

  it('returns false when one or both values are undefined', () => {
    expect(isUsersAccount(undefined, 'uid-123')).toBe(false);
    expect(isUsersAccount('uid-123', undefined)).toBe(false);
    expect(isUsersAccount(undefined, undefined)).toBe(false);
  });
});
