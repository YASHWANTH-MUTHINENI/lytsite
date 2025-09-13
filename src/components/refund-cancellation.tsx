import React from "react";

import { ArrowLeft } from 'lucide-react';

const RefundCancellation: React.FC = () => {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Refund & Cancellation Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last Updated: 10-09-2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            At Lytsite, we strive to provide a seamless and premium file delivery and mini-website creation experience. Please read our Refund & Cancellation Policy carefully before subscribing.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Subscription Plans</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Lytsite offers Free, Standard, Pro, and Business subscription tiers.</li>
              <li>Paid subscriptions are billed on a monthly or annual basis.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Cancellations</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You may cancel your subscription at any time through your account settings.</li>
              <li>Once cancelled, your plan will remain active until the end of the current billing cycle.</li>
              <li>After expiration, your account will automatically downgrade to the Free plan.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Refunds</h2>
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Non-Refundable Services:</strong> Payments made for subscriptions are generally non-refundable, as services are consumed immediately after activation.
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Exceptions:</strong> Refunds may be issued only in the following cases:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Duplicate payment due to technical error.</li>
                <li>Billing error caused by Lytsite's systems.</li>
                <li>Legal requirements under applicable consumer protection laws.</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Trial Periods & Discounts</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>If a trial or promotional offer is provided, you will not be charged until the trial ends.</li>
              <li>Cancellations during the trial period will not incur charges.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Termination by Lytsite</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If we terminate your account for violation of our Terms & Conditions, you are not eligible for a refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. How to Request a Refund</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To request a refund (for eligible cases), please contact us within 7 days of the transaction with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>Transaction ID</li>
              <li>Payment method (Razorpay/Stripe/UPI/Card)</li>
              <li>Reason for refund</li>
            </ul>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                📧 <a href="mailto:support@lytsite.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">support@lytsite.com</a>
              </p>
            </div>
            
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>⏱️ Refund Timeline:</strong> If your refund request is approved, the amount will be credited back to your original payment method within 7 to 14 banking days from the date of approval.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Changes to Policy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Lytsite reserves the right to update this Refund & Cancellation Policy at any time. Continued use of the Services constitutes acceptance of changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundCancellation;
