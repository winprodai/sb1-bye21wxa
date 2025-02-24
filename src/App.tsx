import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Ebooks from './pages/Ebooks';
import Support from './pages/Support';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Register from './pages/Register';
import Login from './pages/Login';
import Account from './pages/Account';
import Pricing from './pages/Pricing';
import ProductDetails from './pages/ProductDetails';
import SavedProducts from './pages/SavedProducts';
import Home from './pages/Home';
import Footer from './components/Footer';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminUsers from './pages/admin/Users';
import AdminCustomers from './pages/admin/Customers';
import AdminLogin from './pages/admin/Login';
import AuthCallback from './pages/auth/Callback';
import Header from './components/Header';
import { supabase } from './lib/supabase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  useEffect((): any => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user) {
        return <Navigate to="/login" replace />;
      }

      if (error) {
        console.error('Error fetching user:', error);
      } else {
        console.log('User:', user);
      }
    }

    fetchUser();
  }, []);

  return <>{children}</>;
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  useEffect(() => {    
   
    const fetchUser= async ()=>{

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user) {
      setIsLogin(false);
    }
    else setIsLogin(true);
  }

  
  fetchUser();
  }, []);

  if(!isLogin) return ( <AuthProvider><Router><Routes><Route path="*" element={<Login />} /></Routes></Router></AuthProvider>);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* OAuth Callback Route */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Admin Routes */}
          <Route path="/admin">
            <Route
              index
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route path="login" element={<AdminLogin />} />
            <Route
              path="products"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="customers"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminCustomers />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
          </Route>

          {/* Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Protected Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header onMenuClick={toggleSidebar} />
                  <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                  <div className="lg:ml-64">
                    <main>
                      <Account />
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header onMenuClick={toggleSidebar} />
                  <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                  <div className="lg:ml-64">
                    <main className="p-4 md:p-6">
                      <Dashboard />
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-products"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header onMenuClick={toggleSidebar} />
                  <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                  <div className="lg:ml-64">
                    <main className="p-4 md:p-6">
                      <SavedProducts />
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header onMenuClick={toggleSidebar} />
                  <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                  <div className="lg:ml-64">
                    <main>
                      <ProductDetails />
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header onMenuClick={toggleSidebar} />
                  <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                  <div className="lg:ml-64">
                    <main>
                      <Courses />
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ebooks"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header onMenuClick={toggleSidebar} />
                  <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                  <div className="lg:ml-64">
                    <main>
                      <Ebooks />
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Header onMenuClick={toggleSidebar} />
                  <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                  <div className="lg:ml-64">
                    <main>
                      <Support />
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
