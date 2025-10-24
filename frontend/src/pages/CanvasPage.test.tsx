import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CanvasPage from './CanvasPage';
import { RecoilRoot } from 'recoil';
import { getSocket } from '../sockets/io';
import { authTokenState } from '../state/auth';

// Mock the socket module
vi.mock('../sockets/io');

// Mock the api module
vi.mock('../api/client', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] })
  },
  setAuthToken: vi.fn()
}));

describe('CanvasPage Component (Unit Tests)', () => {
  const renderCanvasPage = (initialToken: string | null = 'test-token') => {
    const initializeState = ({ set }: any) => {
      set(authTokenState, initialToken);
    };

    return render(
      <RecoilRoot initializeState={initializeState}>
        <CanvasPage />
      </RecoilRoot>
    );
  };

  it('shows login link when no token is present', () => {
    renderCanvasPage(null);
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  it('renders canvas board when token is present', () => {
    renderCanvasPage('valid-token');
    expect(screen.getByTestId('canvas-page')).toBeInTheDocument();
  });

  it('initializes socket connection when token is present', () => {
    renderCanvasPage('valid-token');
    expect(getSocket).toHaveBeenCalledWith('valid-token');
  });
});