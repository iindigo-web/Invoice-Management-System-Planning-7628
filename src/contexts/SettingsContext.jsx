import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Load payment methods from localStorage on initial render
  useEffect(() => {
    const savedPaymentMethods = localStorage.getItem('paymentMethods');
    if (savedPaymentMethods) {
      setPaymentMethods(JSON.parse(savedPaymentMethods));
    } else {
      // Set default payment methods if none exist
      const defaultMethods = [
        {
          id: uuidv4(),
          name: 'Bank Transfer',
          description: 'Please transfer the invoice amount to our bank account.',
          details: 'Bank: Example Bank\nAccount Name: Your Company\nAccount Number: 123456789\nRouting/Sort Code: 987654321',
          isDefault: true,
          createdAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'PayPal',
          description: 'Please send payment via PayPal.',
          details: 'PayPal Email: payments@yourcompany.com',
          isDefault: false,
          createdAt: new Date().toISOString()
        }
      ];
      setPaymentMethods(defaultMethods);
      localStorage.setItem('paymentMethods', JSON.stringify(defaultMethods));
    }
  }, []);

  // Save payment methods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  const createPaymentMethod = (methodData) => {
    const newMethod = {
      id: uuidv4(),
      ...methodData,
      createdAt: new Date().toISOString()
    };

    // If this is marked as default, unmark all others
    if (newMethod.isDefault) {
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: false
        }))
      );
    }

    setPaymentMethods(prev => [...prev, newMethod]);
    return newMethod;
  };

  const updatePaymentMethod = (id, updates) => {
    // If this is being marked as default, unmark all others
    if (updates.isDefault) {
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: false
        }))
      );
    }

    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id 
          ? { ...method, ...updates, updatedAt: new Date().toISOString() } 
          : method
      )
    );
  };

  const deletePaymentMethod = (id) => {
    const methodToDelete = paymentMethods.find(method => method.id === id);
    
    // If deleting the default method, make another one default if available
    if (methodToDelete?.isDefault && paymentMethods.length > 1) {
      const remainingMethods = paymentMethods.filter(method => method.id !== id);
      const newDefault = remainingMethods[0];
      
      setPaymentMethods(
        remainingMethods.map((method, index) => 
          index === 0 
            ? { ...method, isDefault: true } 
            : method
        )
      );
    } else {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
    }
  };

  const getPaymentMethod = (id) => {
    return paymentMethods.find(method => method.id === id);
  };

  const getDefaultPaymentMethod = () => {
    return paymentMethods.find(method => method.isDefault);
  };

  const value = {
    paymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getPaymentMethod,
    getDefaultPaymentMethod
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};