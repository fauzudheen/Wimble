// PricingWrapper.jsx
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Pricing from './Pricing';

const stripePromise = loadStripe('pk_test_51PqUTwH0epnuZaS4IYu58RvosP4xlMPdhNQsDdsbVTO34mCXCalB9AiqUb8etU3m3GjeMDgPKZFgLXM1fUqNNf5v00eF0qVGqy');

const PricingWrapper = () => (
  <Elements stripe={stripePromise}>
    <Pricing />
  </Elements>
);

export default PricingWrapper;
