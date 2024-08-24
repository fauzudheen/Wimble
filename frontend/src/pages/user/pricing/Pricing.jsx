import React, { useEffect, useState } from 'react';
import { CheckIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { GatewayUrl } from '../../../components/const/urls';
import { format, differenceInDays } from 'date-fns';

const Pricing = () => {
  const stripe = useStripe();
  const token = useSelector((state) => state.auth.userAccess);
  const userId = useSelector((state) => state.auth.userId);
  const [user, setUser] = useState(null);

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
        'Meeting scheduling and management',
      ],
      cta: 'Upgrade Now',
      priceId: 'price_1PqXI3H0epnuZaS4GwodNcFJ',
    },
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${GatewayUrl}api/users/${userId}/`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [userId]);

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

  const renderSubscriptionStatus = () => {
    if (!user) return null;

    const isPremium = user.account_tier === 'premium';
    const daysRemaining = differenceInDays(new Date(user.subscription_expiry), new Date());

    return (
      <div className="flex w-full justify-center mt-6">
        <div className="w-3/5"> 
          <div className={`w-full text-center p-4 rounded-lg shadow-md ${isPremium ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>
            <div className="flex items-center justify-center mb-2">
              {isPremium ? (
                <ShieldCheckIcon className="h-6 w-6 mr-2" />
              ) : (
                <ClockIcon className="h-6 w-6 mr-2" />
              )}
              <h3 className="text-lg font-semibold">
                {isPremium ? 'Premium Subscription Active' : 'Free Tier'}
              </h3>
            </div>
            {isPremium && (
              <>
                <p className="text-base mb-1">Expires on: {format(new Date(user.subscription_expiry), 'MMMM d, yyyy')}</p>
                <p className="text-base font-medium">{daysRemaining} days remaining</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
    
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="pt-2 sm:pt-6 lg:pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Choose the plan that's right for you and your team
            </p>
          </div>
          {renderSubscriptionStatus()}
        </div>
      </div>
      <div className="mt-4 pb-8 sm:mt-6 sm:pb-10 lg:pb-14">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-100 dark:bg-gray-900"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
              {tiers.map((tier, tierIdx) => (
                <div
                  key={tier.name}
                  className={`flex-1 bg-white dark:bg-gray-800 px-4 py-6 lg:p-8 ${
                    tierIdx === 0 ? 'lg:rounded-l-lg' : 'lg:rounded-r-lg'
                  } ${user && user.account_tier === tier.name.toLowerCase() ? 'ring-2 ring-teal-500' : ''}`}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {tier.description}
                  </p>
                  <p className="mt-6">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
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
                        <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {tier.cta && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleSubscribe(tier.priceId)}
                        className={`w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
                        bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ease-in-out
                        transform hover:-translate-y-1 hover:shadow-xl
                        ${user && user.account_tier === 'premium' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={user && user.account_tier === 'premium'}
                      >
                        {user && user.account_tier === 'premium' ? 'Current Plan' : tier.cta}
                      </button>
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