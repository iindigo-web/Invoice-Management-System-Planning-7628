import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const InvoiceContext = createContext();

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [templates, setTemplates] = useState([
    {
      id: 'template-1',
      name: 'Professional',
      description: 'Clean and professional template',
      headerColor: '#667eea',
      fontFamily: 'Arial, sans-serif'
    },
    {
      id: 'template-2',
      name: 'Modern',
      description: 'Modern and minimalist design',
      headerColor: '#10b981',
      fontFamily: 'Helvetica, sans-serif'
    },
    {
      id: 'template-3',
      name: 'Corporate',
      description: 'Traditional corporate style',
      headerColor: '#1f2937',
      fontFamily: 'Times New Roman, serif'
    }
  ]);

  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const generateInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();
    const existingInvoices = invoices.filter(invoice => 
      invoice.invoiceNumber.startsWith(`INV-${currentYear}`)
    );
    const nextNumber = existingInvoices.length + 1;
    return `INV-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
  };

  const createInvoice = (invoiceData) => {
    const newInvoice = {
      id: uuidv4(),
      ...invoiceData,
      invoiceNumber: invoiceData.invoiceNumber || generateInvoiceNumber(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (id, updates) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === id 
          ? { ...invoice, ...updates, updatedAt: new Date().toISOString() } 
          : invoice
      )
    );
  };

  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  const getInvoice = (id) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const markAsPaid = (id, paidDate) => {
    updateInvoice(id, {
      status: 'paid',
      paidAt: paidDate || new Date().toISOString()
    });
  };

  const markAsSent = (id) => {
    updateInvoice(id, {
      status: 'sent',
      sentAt: new Date().toISOString()
    });
  };

  const getInvoiceStats = () => {
    const total = invoices.length;
    const draft = invoices.filter(i => i.status === 'draft').length;
    const sent = invoices.filter(i => i.status === 'sent').length;
    const paid = invoices.filter(i => i.status === 'paid').length;
    const overdue = invoices.filter(i => i.status === 'overdue').length;

    const totalAmount = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
    const paidAmount = invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0);

    return {
      total,
      draft,
      sent,
      paid,
      overdue,
      totalAmount,
      paidAmount,
      pendingAmount: totalAmount - paidAmount
    };
  };

  const value = {
    invoices,
    templates,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    markAsPaid,
    markAsSent,
    getInvoiceStats,
    generateInvoiceNumber
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};