import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import CreateEventModalWrapper from './CreateEventModalWrapper';

const mainModalMock = jest.fn(() => null);

jest.mock('@/components/modals/MainModal/MainModal', () => ({
  __esModule: true,
  default: (props: unknown) => mainModalMock(props),
}));

jest.mock('@/components/buttons/squarePlus/SquarePlus', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/components/forms/eventForm/EventFormContainer', () => ({
  __esModule: true,
  default: () => null,
}));

describe('CreateEventModalWrapper', () => {
  beforeEach(() => {
    mainModalMock.mockClear();
  });

  it('passes a non-heading header node to MainModal', () => {
    render(<CreateEventModalWrapper orgName="Org" />);

    const modalProps = mainModalMock.mock.calls[0][0] as { header: ReactElement };
    expect(modalProps.header.type).toBe('span');
    expect(modalProps.header.props.className).toContain('text-center');
  });
});
