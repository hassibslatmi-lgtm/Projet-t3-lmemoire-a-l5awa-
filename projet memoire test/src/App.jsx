import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminDashboard from './components/AdminDashboard';
import FarmerManageProfile from './components/FarmerManageProfile';
import FarmerManageProducts from './components/FarmerManageProducts';
import FarmerDashboard from './components/FarmerDashboard';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProductDetailPage from './components/ProductDetailPage';
import BuyerDashboard from './components/BuyerDashboard';
import PaymentPage from './components/PaymentPage';
import ShopPage from './components/ShopPage';
import TransporterDashboard from './components/TransporterDashboard';
import TransporterManageProfile from './components/TransporterManageProfile';
import TransporterMissions from './components/TransporterMissions';
import TransporterRequests from './components/TransporterRequests';


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
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/payment/:productId" element={<PaymentPage />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/transporter/dashboard" element={<TransporterDashboard />} />
        <Route path="/transporter/profile" element={<TransporterManageProfile />} />
        <Route path="/transporter/requests" element={<TransporterRequests />} />
        <Route path="/transporter/missions" element={<TransporterMissions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
// trigger HMR rebuild
