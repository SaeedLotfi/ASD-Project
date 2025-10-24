import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { authTokenState } from './state/auth';
import App from './App';

// Mock the socket module
vi.mock('./sockets/io');

// Helper function to render App with required providers
const renderApp = (initialAuthToken: string | null = null, initialPath: string = '/') => {
  const initializeState = ({ set }: any) => {
    set(authTokenState, initialAuthToken);
  };

  return render(
    <RecoilRoot initializeState={initializeState}>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </RecoilRoot>
  );
};

describe('App (Integration Tests)', () => {
  it('redirects to login when no token is present', () => {
    renderApp(null, '/');
    // We can't test window.location directly with MemoryRouter
    // Instead, we check if the Login component is rendered
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('shows CanvasPage when token is present and at root path', () => {
    renderApp('valid-token', '/');
    expect(screen.getByTestId('canvas-page')).toBeInTheDocument();
  });

  it('shows Login page when accessing /login directly', () => {
    renderApp('valid-token', '/login');
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});