import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import createAxiosInstance from '../../api/axiosInstance';
import { GatewayUrl } from '../const/urls';
import { Alert, AlertDescription } from '../UIComponents';

const Pricing = () => {
  const [pricings, setPricings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTier, setNewTier] = useState({ tier: '', price: '', description: '', benefits: '', stripe_price_id: '' });
  const [error, setError] = useState(null);
  const token = useSelector(state => state.auth.adminAccess);

  useEffect(() => {
    fetchPricings();
  }, []);

  const fetchPricings = async () => {
    const axiosInstance = createAxiosInstance(token);
    try {
      const response = await axiosInstance.get(`${GatewayUrl}api/pricing/`);
      setPricings(response.data);
    } catch (error) {
      console.error('Error fetching pricings:', error);
      setError('Failed to fetch pricing data. Please try again later.');
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    const axiosInstance = createAxiosInstance(token);
    try {
      await axiosInstance.put(`${GatewayUrl}api/pricing/${id}/`, pricings.find(p => p.id === id));
      setEditingId(null);
      fetchPricings();
    } catch (error) {
      console.error('Error updating pricing:', error);
      setError('Failed to update pricing. Please try again.');
    }
  };

  const handleChange = (id, field, value) => {
    setPricings(pricings.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleAddTier = async () => {
    const axiosInstance = createAxiosInstance(token);
    try {
      await axiosInstance.post(`${GatewayUrl}api/pricing/`, newTier);
      setNewTier({ tier: '', price: '', description: '', benefits: '', stripe_price_id: '' });
      fetchPricings();
    } catch (error) {
      console.error('Error adding new tier:', error);
      setError('Failed to add new tier. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const axiosInstance = createAxiosInstance(token);
    try {
      await axiosInstance.delete(`${GatewayUrl}api/pricing/${id}/`);
      fetchPricings();
    } catch (error) {
      console.error('Error deleting tier:', error);
      setError('Failed to delete tier. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold leading-tight mb-6 text-gray-900 dark:text-white text-center">Pricing</h2>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          We follow a "Freemium" model where we keep the free pricing indefinitely and encourage users to upgrade with a monthly subscription.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pricings.map((pricing) => (
            <div key={pricing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
              <div className="bg-gray-100 dark:bg-gray-700 p-6">
                {editingId === pricing.id ? (
                  <input
                    className="text-2xl font-semibold text-gray-900 dark:text-white w-full mb-2 bg-transparent"
                    value={pricing.tier}
                    onChange={(e) => handleChange(pricing.id, 'tier', e.target.value)}
                  />
                ) : (
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white capitalize">{pricing.tier}</h3>
                )}
                {editingId === pricing.id ? (
                  <input
                    className="text-3xl font-bold text-gray-900 dark:text-white w-full bg-transparent"
                    value={pricing.price}
                    onChange={(e) => handleChange(pricing.id, 'price', e.target.value)}
                  />
                ) : (
                  <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">₹{pricing.price}<span className="text-base font-medium text-gray-500 dark:text-gray-400">/month</span></p>
                )}
              </div>
              <div className="flex-1 p-6">
                {editingId === pricing.id ? (
                  <>
                    <textarea
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white mb-4"
                      value={pricing.description}
                      onChange={(e) => handleChange(pricing.id, 'description', e.target.value)}
                      placeholder="Description"
                    />
                    <textarea
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white mb-4"
                      value={pricing.benefits}
                      onChange={(e) => handleChange(pricing.id, 'benefits', e.target.value)}
                      placeholder="Benefits (one per line)"
                    />
                    <input
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                      value={pricing.stripe_price_id}
                      onChange={(e) => handleChange(pricing.id, 'stripe_price_id', e.target.value)}
                      placeholder="Stripe Price ID"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{pricing.description}</p>
                    <ul className="space-y-4">
                      {pricing.benefits.split('\n').map((benefit, index) => (
                        <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Stripe Price ID: {pricing.stripe_price_id}</p>
                  </>
                )}
              </div>
              <div className="p-6 flex justify-between">
                {editingId === pricing.id ? (
                  <button
                    onClick={() => handleSave(pricing.id)}
                    className="flex-1 bg-gradient-to-r from-teal-400 to-blue-500 text-sm text-white rounded-md py-2 font-semibold hover:from-teal-500 hover:to-blue-600 transition duration-300"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(pricing.id)}
                    className="flex-1 bg-gradient-to-r from-teal-400 to-blue-500 text-sm text-white rounded-md py-2 font-semibold hover:from-teal-500 hover:to-blue-600 transition duration-300"
                  >
                    Edit Tier
                  </button>
                )}
                <button
                  onClick={() => handleDelete(pricing.id)}
                  className="ml-2 bg-gradient-to-r from-red-500 to-red-600 text-sm text-white rounded-md px-3 py-2 font-semibold hover:from-red-600 hover:to-red-700 transition duration-300"
                  aria-label="Delete tier"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {pricings.length < 2 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add New Tier</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Tier Name"
                value={newTier.tier}
                onChange={(e) => setNewTier({...newTier, tier: e.target.value})}
              />
              <input
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Price"
                type="number"
                value={newTier.price}
                onChange={(e) => setNewTier({...newTier, price: e.target.value})}
              />
              <textarea
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Description"
                value={newTier.description}
                onChange={(e) => setNewTier({...newTier, description: e.target.value})}
              />
              <textarea
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Benefits (one per line)"
                value={newTier.benefits}
                onChange={(e) => setNewTier({...newTier, benefits: e.target.value})}
              />
              <input
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Stripe Price ID"
                value={newTier.stripe_price_id}
                onChange={(e) => setNewTier({...newTier, stripe_price_id: e.target.value})}
              />
              <button
                onClick={handleAddTier}
                className="w-full bg-blue-500 text-white rounded-md py-2 font-semibold hover:bg-blue-600 transition duration-300"
              >
                Add New Tier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;