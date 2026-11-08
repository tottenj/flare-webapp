import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RootLayout from './layout';

jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist' }),
  Plus_Jakarta_Sans: () => ({ variable: 'plus-jakarta-sans' }),
}));

jest.mock('@vercel/analytics/next', () => ({ Analytics: () => null }));
jest.mock('@vercel/speed-insights/next', () => ({ SpeedInsights: () => null }));
jest.mock('react-toastify', () => ({ ToastContainer: () => null }));
jest.mock('@heroui/react', () => ({
  Button: ({ children, onPress }: { children: React.ReactNode; onPress: () => void }) => (
    <button onClick={onPress}>{children}</button>
  ),
}));
jest.mock('@/components/banners/mainBanner/MainBanner', () => {
  const { ThemeToggle } = require('@/components/ui/ThemeToggle/ThemeToggle');
  return { __esModule: true, default: () => <ThemeToggle /> };
});

test('the banner toggle changes and persists the document theme', async () => {
  localStorage.setItem('theme', 'light');
  window.matchMedia = jest.fn().mockReturnValue({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  });

  const layout = await RootLayout({ children: null, modal: null });
  render(layout.props.children.props.children);

  fireEvent.click(await screen.findByRole('button', { name: 'Dark Mode' }));
  await waitFor(() => expect(document.documentElement).toHaveClass('dark'));
  expect(localStorage.getItem('theme')).toBe('dark');

  fireEvent.click(screen.getByRole('button', { name: 'Light Mode' }));
  await waitFor(() => expect(document.documentElement).toHaveClass('light'));
  expect(localStorage.getItem('theme')).toBe('light');
});
