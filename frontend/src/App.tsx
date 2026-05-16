import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/use-toast';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Documents } from './pages/Documents';
import { Tasks } from './pages/Tasks';
import { Emails } from './pages/Emails';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Wird geladen...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="customers" element={
                  <PrivateRoute>
                    <Customers />
                  </PrivateRoute>
                } />
                <Route path="documents" element={
                  <PrivateRoute>
                    <Documents />
                  </PrivateRoute>
                } />
                <Route path="tasks" element={
                  <PrivateRoute>
                    <Tasks />
                  </PrivateRoute>
                } />
                <Route path="emails" element={
                  <PrivateRoute>
                    <Emails />
                  </PrivateRoute>
                } />
                <Route path="users" element={
                  <PrivateRoute>
                    <Users />
                  </PrivateRoute>
                } />
                <Route path="settings" element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
