// Pricing.jsx

import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { GatewayUrl } from '../../../components/const/urls';

const Pricing = () => {
  const stripe = useStripe();
  const token = useSelector((state) => state.auth.userAccess);

  const tiers = [
    {
      name: 'Free',
      price: '₹0',
      frequency: '/month',
      description: 'Great for individuals and small teams getting started.',
      features: [
        'User profile creation',
        'Community participation',
        'Basic team functionalities',
        'Team joining (max 3 members)',
      ],
    },
    {
      name: 'Premium',
      price: '₹500',
      frequency: '/month',
      description: 'Perfect for growing teams and advanced functionalities.',
      features: [
        'All Free Tier features',
        'Advanced team functionalities',
        'Expanded team membership (max 10 members)',
        'Meeting scheduling and management',
      ],
      cta: 'Upgrade Now',
      priceId: 'price_1PqXI3H0epnuZaS4GwodNcFJ', // Replace with your actual Stripe Price ID
    },
  ];

  const handleSubscribe = async (priceId) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.post(`${GatewayUrl}api/payments/create-checkout-session/`, {
        priceId: priceId,
      });

      const session = response.data;
 
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <div className="pt-4 sm:pt-8 lg:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Choose the plan that's right for you and your team
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 pb-12 sm:mt-8 sm:pb-16 lg:pb-20">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-100 dark:bg-gray-900"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
              {tiers.map((tier, tierIdx) => (
                <div
                  key={tier.name}
                  className={`flex-1 bg-white dark:bg-gray-800 px-4 py-6 lg:p-8 ${
                    tierIdx === 0 ? 'lg:rounded-l-lg' : 'lg:rounded-r-lg'
                  }`}
                >
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                    {tier.name}
                  </h3>
                  <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
                    {tier.description}
                  </p>
                  <p className="mt-6">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                      {tier.price}
                    </span>{' '}
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {tier.frequency}
                    </span>
                  </p>
                  <ul role="list" className="mt-6 space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                        </div>
                        <p className="ml-2 text-base text-gray-700 dark:text-gray-300">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {tier.cta && (
                    <div className="mt-6">
                      <div className="rounded-lg shadow-md w-2/4 mx-auto">
                        <button
                          onClick={() => handleSubscribe(tier.priceId)}
                          className="block w-full text-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium 
                          bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700
                          dark:bg-gradient-to-r dark:from-teal-600 dark:to-blue-700 dark:hover:from-teal-700 dark:hover:to-blue-800"
                        >
                          {tier.cta}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;