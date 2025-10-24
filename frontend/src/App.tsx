import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CanvasPage from './pages/CanvasPage';
import { useRecoilValue } from 'recoil';
import { authTokenState } from './state/auth';

export default function App() {
  const token = useRecoilValue(authTokenState);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={token ? <CanvasPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}
