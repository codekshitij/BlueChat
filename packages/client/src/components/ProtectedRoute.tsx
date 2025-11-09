import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';



interface ProtectedRouteProps {
  children: React.ReactNode;
}


export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initializing } = useFirebaseAuth();
  
  console.log('ProtectedRoute: initializing:', initializing, 'user:', user?.uid || 'null');
  
  // Show nothing while checking auth state
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute: User authenticated, rendering children');
  return <>{children}</>;
}
