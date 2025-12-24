import preview from '#.storybook/preview';
import SignUpFormPresentational from './SignUpFormPresentational';

const meta = preview.meta({ component: SignUpFormPresentational, title: "Forms/User Sign Up Form", tags: ['autodocs'] });
export default meta

export const Default = meta.story({
  args: {
    pending: false,
    onSubmit: () => {},
  },
});

export const ValidationErrors = meta.story({
  args: {
    validationErrors: {
      email: ['Email Error'],
    },
    pending: false,
    onSubmit: () => {},
  },
});

export const Pending = meta.story({
  args: {
    pending: true,
    onSubmit: () => {}
  },
});

export const GeneralError = meta.story({
  args: {
    pending: false,
    error: 'General Error',
    onSubmit: () => {},
  },
});
