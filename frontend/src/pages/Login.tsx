import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import api from '../api/client';
import { authTokenState } from '../state/auth';

export default function Login() {
  const setToken = useSetRecoilState(authTokenState);
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.access_token);
    window.location.href = '/';
  };

  return (
    <div data-testid="login-page" style={{ display:'grid', placeItems:'center', height:'100vh' }}>
      <form onSubmit={submit} style={{ display:'grid', gap:12, width:280 }}>
        <h2>Login</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <button type="submit">Sign in</button>
        <button type="button" onClick={async ()=>{
          await api.post('/auth/register', { email, password });
          alert('Registered. Now click Sign in.');
        }}>Register</button>
      </form>
    </div>
  );
}
