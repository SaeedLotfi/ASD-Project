import { atom } from 'recoil';
import { setAuthToken } from '../api/client';

const initial =
  (typeof localStorage !== 'undefined' && localStorage.getItem('access_token')) || null;

export const authTokenState = atom<string | null>({
  key: 'authToken',
  default: initial,
  effects: [
    ({ onSet, setSelf }) => {
      // Initialize axios header from initial value
      setAuthToken(initial);

      // Sync token changes to axios header and localStorage
      onSet((token) => {
        setAuthToken(token);
        if (typeof localStorage !== 'undefined') {
          if (token) localStorage.setItem('access_token', token);
          else localStorage.removeItem('access_token');
        }
      });
    },
  ],
});

export const currentUserState = atom<{ email: string } | null>({
  key: 'currentUser',
  default: null,
});
