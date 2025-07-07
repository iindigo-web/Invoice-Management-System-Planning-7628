import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiDollarSign, FiClock, FiSave, FiCheck, FiCreditCard, FiPlus, FiEdit, FiTrash2 } = FiIcons;

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { paymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useSettings();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
    address: user?.address || '',
    website: user?.website || '',
    taxId: user?.taxId || ''
  });
  
  const [settingsData, setSettingsData] = useState({
    defaultCurrency: user?.defaultCurrency || 'USD',
    defaultDueDays: user?.defaultDueDays || 30
  });

  // Payment method modal state
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
  const [paymentMethodFormData, setPaymentMethodFormData] = useState({
    name: '',
    description: '',
    details: '',
    isDefault: false
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

  const tabs = [
    { id: 'profile', name: 'Profile', icon: FiUser },
    { id: 'preferences', name: 'Preferences', icon: FiDollarSign },
    { id: 'payment-methods', name: 'Payment Methods', icon: FiCreditCard }
  ];

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSettingsChange = (e) => {
    const value = e.target.name === 'defaultDueDays' ? parseInt(e.target.value) : e.target.value;
    setSettingsData({ ...settingsData, [e.target.name]: value });
  };

  const handlePaymentMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentMethodFormData({
      ...paymentMethodFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      const result = await updateProfile({
        ...profileData,
        ...settingsData
      });
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    setEditingPaymentMethod(null);
    setPaymentMethodFormData({
      name: '',
      description: '',
      details: '',
      isDefault: false
    });
    setShowPaymentMethodModal(true);
  };

  const handleEditPaymentMethod = (method) => {
    setEditingPaymentMethod(method);
    setPaymentMethodFormData({
      name: method.name,
      description: method.description,
      details: method.details,
      isDefault: method.isDefault
    });
    setShowPaymentMethodModal(true);
  };

  const handleDeletePaymentMethod = (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      deletePaymentMethod(id);
    }
  };

  const handlePaymentMethodSubmit = (e) => {
    e.preventDefault();
    
    if (editingPaymentMethod) {
      updatePaymentMethod(editingPaymentMethod.id, paymentMethodFormData);
    } else {
      createPaymentMethod(paymentMethodFormData);
    }
    
    setShowPaymentMethodModal(false);
  };

  const handleSetDefault = (id) => {
    updatePaymentMethod(id, { isDefault: true });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
        >
          <SafeIcon icon={FiCheck} className="h-5 w-5 mr-2" />
          Settings updated successfully!
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm inline-flex items-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleProfileChange}
                      className="form-input"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax ID / VAT Number
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={profileData.taxId}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    className="form-input"
                    rows="3"
                    placeholder="Enter your business address"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Currency
                    </label>
                    <select
                      name="defaultCurrency"
                      value={settingsData.defaultCurrency}
                      onChange={handleSettingsChange}
                      className="form-input"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name} ({currency.code})
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      This will be used as the default currency for new invoices. Individual clients can have their own currency settings.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Due Days
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="defaultDueDays"
                        value={settingsData.defaultDueDays}
                        onChange={handleSettingsChange}
                        className="form-input pr-12"
                        min="1"
                        max="365"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">days</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Number of days from issue date to automatically calculate due date for new invoices.
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <SafeIcon icon={FiClock} className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">How Default Settings Work</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        • <strong>Currency:</strong> New invoices will use your default currency unless the client has a specific currency set
                      </p>
                      <p className="text-sm text-blue-700">
                        • <strong>Due Days:</strong> When creating invoices, the due date will be automatically calculated based on the issue date plus your default due days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payment-methods' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                <button
                  type="button"
                  onClick={handleAddPaymentMethod}
                  className="btn-secondary inline-flex items-center"
                >
                  <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
                  Add Payment Method
                </button>
              </div>
              
              <p className="text-sm text-gray-600">
                Add payment methods that will appear on your invoices. Clients will see these details when they receive your invoice.
              </p>
              
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiCreditCard} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No payment methods added yet</p>
                  <button
                    type="button"
                    onClick={handleAddPaymentMethod}
                    className="btn-primary mt-4 inline-flex items-center"
                  >
                    <SafeIcon icon={FiPlus} className="h-5 w-5 mr-2" />
                    Add First Payment Method
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      className={`p-4 border rounded-lg ${method.isDefault ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-lg font-medium text-gray-900">{method.name}</h4>
                            {method.isDefault && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{method.description}</p>
                          <pre className="mt-2 text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-md border border-gray-200">
                            {method.details}
                          </pre>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditPaymentMethod(method)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <SafeIcon icon={FiEdit} className="h-4 w-4" />
                          </button>
                          {!method.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(method.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Set as Default"
                            >
                              <SafeIcon icon={FiCheck} className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Save Button - Only show for profile and preferences tabs */}
          {(activeTab === 'profile' || activeTab === 'preferences') && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center"
                >
                  <SafeIcon icon={FiSave} className="h-5 w-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Payment Method Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-lg w-full p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingPaymentMethod ? 'Edit Payment Method' : 'Add Payment Method'}
            </h2>
            
            <form onSubmit={handlePaymentMethodSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Method Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={paymentMethodFormData.name}
                  onChange={handlePaymentMethodChange}
                  className="form-input"
                  placeholder="e.g., Bank Transfer, PayPal, Credit Card"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={paymentMethodFormData.description}
                  onChange={handlePaymentMethodChange}
                  className="form-input"
                  placeholder="e.g., Please transfer the invoice amount to our bank account"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Details
                </label>
                <textarea
                  name="details"
                  value={paymentMethodFormData.details}
                  onChange={handlePaymentMethodChange}
                  className="form-input"
                  rows="5"
                  placeholder="e.g., Bank: Example Bank&#10;Account Name: Your Company&#10;Account Number: 123456789&#10;Routing/Sort Code: 987654321"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter each detail on a new line. This information will appear on your invoices.
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={paymentMethodFormData.isDefault}
                  onChange={handlePaymentMethodChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default payment method
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingPaymentMethod ? 'Update Method' : 'Add Method'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentMethodModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;