import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RestaurantMenu from './pages/RestaurantMenu';
import Checkout from './pages/Checkout';
import StudentOrders from './pages/StudentOrders';
import VendorDashboard from './pages/VendorDashboard';
import VendorRestaurant from './pages/VendorRestaurant';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute requiredRole="student">
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/restaurant/:id" 
            element={
              <ProtectedRoute requiredRole="student">
                <RestaurantMenu />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute requiredRole="student">
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentOrders />
              </ProtectedRoute>
            } 
          />

          {/* Vendor Routes */}
          <Route 
            path="/vendor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/restaurant" 
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorRestaurant />
              </ProtectedRoute>
            } 
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
