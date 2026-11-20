import { orgCreateValues } from './orgCreateSchema';
import { createStore, type GlobalState } from 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    orgSignUpDraft: orgCreateValues;
  }
}

const emptyDraft: orgCreateValues = {
  name: '',
  location: undefined,
  description: '',
  email: '',
  phone: '',
  website: '',
  socialProofType: 'other',
  socialProofDetails: '',
  socialProofFile: undefined,
};

createStore({ orgSignUpDraft: emptyDraft });

export function saveDraft(state: GlobalState, values: orgCreateValues): GlobalState {
  return {
    ...state,
    orgSignUpDraft: {
      ...values,
    },
  };
}

export function clearDraft(state: GlobalState): GlobalState {
  return { ...state, orgSignUpDraft: emptyDraft };
}
