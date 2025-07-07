import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ClientContext = createContext();

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const createClient = (clientData) => {
    const newClient = {
      id: uuidv4(),
      ...clientData,
      currency: clientData.currency || 'USD', // Default to USD if not specified
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id, updates) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id
          ? { ...client, ...updates, updatedAt: new Date().toISOString() }
          : client
      )
    );
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const getClient = (id) => {
    return clients.find(client => client.id === id);
  };

  const value = {
    clients,
    createClient,
    updateClient,
    deleteClient,
    getClient
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};