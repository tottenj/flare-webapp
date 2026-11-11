import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';
import RootLayout from './layout';

jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist' }),
  Plus_Jakarta_Sans: () => ({ variable: 'plus-jakarta-sans' }),
}));

jest.mock('@vercel/analytics/next', () => ({ Analytics: () => null }));
jest.mock('@vercel/speed-insights/next', () => ({ SpeedInsights: () => null }));
jest.mock('react-toastify', () => ({ ToastContainer: () => null }));
jest.mock('@heroui/react', () => {
  const Part = () => null;
  const SelectRoot = ({
    value,
    onChange,
    'aria-label': label,
  }: {
    value: string;
    onChange: (value: string) => void;
    'aria-label': string;
  }) => (
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );

  return {
    Select: Object.assign(SelectRoot, {
      Trigger: Part,
      Value: Part,
      Indicator: Part,
      ClearButton: Part,
      Popover: Part,
    }),
    ListBox: Object.assign(Part, { Item: Object.assign(Part, { ItemIndicator: Part }) }),
    Toast: { Provider: Part },
  };
});
test('the theme selector changes and persists light, dark, and system preferences', async () => {
  localStorage.setItem('theme', 'light');
  window.matchMedia = jest.fn().mockReturnValue({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  });

  const layout = await RootLayout({ children: <ThemeToggle />, modal: null });
  render(layout.props.children.props.children);

  const select = await screen.findByRole('combobox', { name: 'Theme' });
  expect(select).toHaveValue('light');
  fireEvent.change(select, { target: { value: 'dark' } });
  await waitFor(() => expect(document.documentElement).toHaveClass('dark'));
  expect(localStorage.getItem('theme')).toBe('dark');

  fireEvent.change(select, { target: { value: 'light' } });
  await waitFor(() => expect(document.documentElement).toHaveClass('light'));
  expect(localStorage.getItem('theme')).toBe('light');

  fireEvent.change(select, { target: { value: 'system' } });
  await waitFor(() => expect(select).toHaveValue('system'));
  expect(document.documentElement).toHaveClass('light');
  expect(localStorage.getItem('theme')).toBe('system');
});
