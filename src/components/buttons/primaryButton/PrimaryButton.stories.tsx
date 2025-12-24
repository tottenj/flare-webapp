import PrimaryButton from './PrimaryButton';
import preview from '#.storybook/preview.js';

const meta = preview.meta({ component: PrimaryButton, title: 'Buttons/Primary Button' });

export const Default = meta.story({
  args: {
    text: 'Submit',
    type: 'button',
    disabled: false,
    styleOver: undefined,
    size: 'small',
    action: undefined,
    click: undefined,
    form: '',
    datacy: '',
    state: 'initial',
  },
});

export const Disabled = meta.story({
  args: {
    ...Default.composed.args,
    disabled: true,
    
  },
});

export const Full = meta.story({
  args: {
    ...Default.composed.args,
    size: 'full',
  },
});