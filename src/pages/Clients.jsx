import React, { useState } from 'react';
import { useClients } from '../contexts/ClientContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiDollarSign } = FiIcons;

const Clients = () => {
  const { clients, createClient, updateClient, deleteClient } = useClients();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    currency: user?.defaultCurrency || 'USD'
  });

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      createClient(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      currency: user?.defaultCurrency || 'USD'
    });
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      address: client.address,
      currency: client.currency || user?.defaultCurrency || 'USD'
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCurrencySymbol = (currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '$';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your client relationships</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary inline-flex items-center"
        >
          <SafeIcon icon={FiPlus} className="h-5 w-5 mr-2" />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Client Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="form-input"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingClient ? 'Update Client' : 'Add Client'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <SafeIcon icon={FiUser} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No clients found</p>
            <p className="text-gray-400">Add your first client to get started</p>
          </div>
        ) : (
          filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <SafeIcon icon={FiUser} className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{client.name}</h3>
              <div className="space-y-2">
                {client.company && (
                  <p className="text-sm text-gray-600">{client.company}</p>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiMail} className="h-4 w-4 mr-2" />
                  {client.email}
                </div>
                {client.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiPhone} className="h-4 w-4 mr-2" />
                    {client.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiDollarSign} className="h-4 w-4 mr-2" />
                  {getCurrencySymbol(client.currency || 'USD')} {client.currency || 'USD'}
                </div>
                {client.address && (
                  <p className="text-sm text-gray-600 mt-2">{client.address}</p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Clients;