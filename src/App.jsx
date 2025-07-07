import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { ClientProvider } from './contexts/ClientContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import CreateInvoice from './pages/CreateInvoice';
import EditInvoice from './pages/EditInvoice';
import InvoicePreview from './pages/InvoicePreview';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <InvoiceProvider>
          <ClientProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="create-invoice" element={<CreateInvoice />} />
                  <Route path="edit-invoice/:id" element={<EditInvoice />} />
                  <Route path="invoice-preview/:id" element={<InvoicePreview />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ClientProvider>
        </InvoiceProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;