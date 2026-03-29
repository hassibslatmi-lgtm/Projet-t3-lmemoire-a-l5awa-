import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminDashboard from './components/AdminDashboard';
import FarmerManageProfile from './components/FarmerManageProfile';
import FarmerManageProducts from './components/FarmerManageProducts';
import FarmerDashboard from './components/FarmerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/farmer/profile" element={<FarmerManageProfile />} />
        <Route path="/farmer/products" element={<FarmerManageProducts />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
// trigger HMR rebuild
