import React, { useState } from 'react';
import { Store, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BusinessType, businessTypeLabels } from '../../types/shop';

const AddListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      business_type: formData.get('business_type') as string,
      address1: formData.get('address1') as string,
      address2: formData.get('address2') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip_code: formData.get('zip_code') as string,
      country: 'US',
      website: formData.get('website') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      has_cbd: formData.get('has_cbd') === 'true',
      has_marijuana: formData.get('has_marijuana') === 'true',
      has_kratom: formData.get('has_kratom') === 'true',
      date_added: new Date().toISOString(),
    };

    try {
      const { error: insertError } = await supabase
        .from('shops')
        .insert([data]);

      if (insertError) throw insertError;

      navigate('/listing-submitted');
    } catch (err) {
      setError('Failed to submit listing. Please try again.');
      console.error('Error submitting listing:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Store className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-amber-500 mb-2">Add Your Business</h1>
            <p className="text-amber-300/80">
              List your shop in our directory to reach more customers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-xl border border-amber-500/20">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Business Type *
                </label>
                <select
                  name="business_type"
                  required
                  className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 focus:outline-none focus:border-amber-500"
                >
                  {Object.entries(businessTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="address1"
                    required
                    className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address2"
                    className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500"
                    placeholder="Suite, unit, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    maxLength={2}
                    className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    required
                    className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 bg-black border border-amber-900 rounded-lg text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-4">
                  Products Offered
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="has_cbd"
                      value="true"
                      className="w-4 h-4 text-amber-500 border-amber-900 rounded focus:ring-amber-500 focus:ring-offset-black"
                    />
                    <span className="ml-2 text-amber-100">CBD Products</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="has_marijuana"
                      value="true"
                      className="w-4 h-4 text-amber-500 border-amber-900 rounded focus:ring-amber-500 focus:ring-offset-black"
                    />
                    <span className="ml-2 text-amber-100">Marijuana Products</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="has_kratom"
                      value="true"
                      className="w-4 h-4 text-amber-500 border-amber-900 rounded focus:ring-amber-500 focus:ring-offset-black"
                    />
                    <span className="ml-2 text-amber-100">Kratom</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Listing'}
              </button>
            </div>
          </form>

          <p className="text-center mt-6 text-amber-500/60 text-sm">
            By submitting a listing, you agree to our{' '}
            <a href="#" className="text-amber-500 hover:text-amber-400">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddListingPage;