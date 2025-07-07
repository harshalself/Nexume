import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Providers from "./contexts/Providers";
import DashboardLayout from "./layouts/DashboardLayout";
import { publicRoutes, protectedRoutes, RouteConfig } from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Helper function to create protected route
const createProtectedRoute = (Component: React.ComponentType) => (
  <ProtectedRoute>
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Providers>
        <Router>
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                Loading.....
              </div>
            }>
            <Routes>
              {/* Public routes */}
              {publicRoutes.map(({ path, element: Element }: RouteConfig) => (
                <Route key={path} path={path} element={<Element />} />
              ))}

              {/* Protected dashboard routes */}
              {protectedRoutes.map(
                ({ path, element: Element }: RouteConfig) => (
                  <Route
                    key={path}
                    path={path}
                    element={createProtectedRoute(Element)}
                  />
                )
              )}
            </Routes>
          </React.Suspense>
        </Router>
      </Providers>
    </AuthProvider>
  );
}

export default App;
