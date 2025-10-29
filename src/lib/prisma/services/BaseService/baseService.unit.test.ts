
import requireAuth from '@/lib/firebase/auth/utils/requireAuth';
import BaseService from './baseService';
import { expect } from '@jest/globals';

jest.mock('@/lib/firebase/auth/utils/requireAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('BaseService', () => {
  class EmptyDal {}

  class TestService extends BaseService<EmptyDal, 'test'> {
    publicFields = { test: true };
  }

  describe('BaseService', () => {
    let service: TestService;

    beforeEach(() => {
      jest.clearAllMocks();
      service = new TestService(EmptyDal);
    });

    it('getPublicFields returns publicFields', () => {
      expect(service.getPublicFields()).toEqual({ test: true });
    });
  });
});
