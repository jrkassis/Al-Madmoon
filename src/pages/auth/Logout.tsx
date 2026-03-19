import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to sign in
    navigate('/auth/signin', { replace: true });
  }, [navigate]);

  return (
    <div className="animated-mesh-bg min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 text-center">
        <p className="text-slate-600">Logging out...</p>
      </div>
    </div>
  );
}