import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { RecoilRoot } from 'recoil';
import api from '../api/client';

// Mock the api module
vi.mock('../api/client', () => ({
  default: {
    post: vi.fn()
  },
  setAuthToken: vi.fn()
}));

describe('Login Component (Unit Tests)', () => {
  const renderLogin = () => {
    return render(
      <RecoilRoot>
        <Login />
      </RecoilRoot>
    );
  };

  it('renders login form elements', () => {
    renderLogin();
    
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('testpass');
  });

  it('calls api.post when register button is clicked', async () => {
    renderLogin();
    
    const registerButton = screen.getByText('Register');
    await fireEvent.click(registerButton);

    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      email: 'demo@example.com',
      password: 'password'
    });
  });
});