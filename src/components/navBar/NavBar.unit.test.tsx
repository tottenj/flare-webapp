import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import NavBar from './NavBar';

jest.mock(
  '@/components/navBar/NavBarAvatar',
  () =>
    function MockNavBarAvatar() {
      return <div>Avatar</div>;
    }
);

describe('NavBar', () => {
  it('renders the navigation links with their existing destinations', () => {
    render(<NavBar />);

    expect(screen.getByRole('link', { name: 'Explore' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Organizations' })).toHaveAttribute('href', '/');
  });
});
