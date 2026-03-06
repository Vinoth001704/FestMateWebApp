import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthProvider';

/**
 * AutoRedirect Component
 * Automatically redirects logged-in users to their dashboard based on role
 * Redirects non-authenticated users to login
 */
export const AutoRedirect = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    if (!user) {
      // Not logged in, redirect to login
      navigate('/login', { replace: true });
      return;
    }

    // Auto-redirect based on role
    const roleRoutes = {
      'Admin': '/admin',
      'Coordinator': '/coordinator',
      'Student': '/student',
    };

    const redirectPath = roleRoutes[user.role];
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    } else {
      // Fallback if role doesn't match
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Show loading while redirecting
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Redirecting...</h2>
        <p>Please wait while we redirect you to your dashboard.</p>
      </div>
    </div>
  );
};
