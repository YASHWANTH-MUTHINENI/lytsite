import React from "react";

import { ArrowLeft } from 'lucide-react';

const TermsConditions: React.FC = () => {
  

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
            Terms & Conditions
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last Updated: 10-09-2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Welcome to Lytsite ("we," "our," "us"). By accessing or using our website, services, or applications (the "Services"), you agree to comply with and be bound by these Terms & Conditions. Please read them carefully.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Eligibility</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You must be at least 13 years old (or the legal minimum age in your country) to use Lytsite.</li>
              <li>By creating an account, you confirm you have the authority to enter into this agreement.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Services</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Lytsite provides:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>File uploading, hosting, and sharing.</li>
              <li>Branded mini-website creation for file delivery, portfolios, galleries, and resumes.</li>
              <li>Free and paid subscription plans with additional features.</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              We may update, modify, or discontinue features at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Upload illegal, infringing, or harmful content.</li>
              <li>Misuse the service for spam, malware, or unauthorized access attempts.</li>
              <li>Violate applicable laws, copyrights, or third-party rights.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Accounts & Security</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You are responsible for keeping your login credentials secure.</li>
              <li>Any activity under your account will be considered your responsibility.</li>
              <li>Notify us immediately if you suspect unauthorized use of your account.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. File Storage & Delivery</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Files may be stored temporarily depending on your plan.</li>
              <li>Expired or deleted files may not be recoverable.</li>
              <li>We are not responsible for permanent storage or backups.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Subscription Plans & Payments</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Lytsite offers Free, Standard, Pro, and Business tiers.</li>
              <li>Subscriptions are billed monthly or annually through Razorpay/Stripe.</li>
              <li>Fees are non-refundable except as required by law.</li>
              <li>Non-payment may result in account suspension or deletion.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Intellectual Property</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You retain ownership of files you upload.</li>
              <li>By uploading, you grant Lytsite a limited license to store, process, and display your files for providing services.</li>
              <li>Lytsite branding, templates, and platform design remain our property.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Termination of Use</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You may cancel your account anytime.</li>
              <li>We may suspend or terminate accounts violating these Terms.</li>
              <li>Upon termination, access to Services will end, and files may be deleted.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Warranties & Disclaimers</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Lytsite is provided "as is" without guarantees.</li>
              <li>We do not warrant uninterrupted, error-free, or fully secure operation.</li>
              <li>You use the Services at your own risk.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Limitation of Liability</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Lytsite is not responsible for indirect, incidental, or consequential damages.</li>
              <li>Our liability is limited to the amount paid by you in the last 90 days of service.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Changes to Terms</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>We may revise these Terms periodically.</li>
              <li>Continued use of Lytsite after updates means you accept the changes.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Governing Law</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>These Terms shall be governed by the laws of India (or country of registration).</li>
              <li>Disputes will be handled in the courts of [Insert City], India.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions or complaints, reach us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                📧 <a href="mailto:support@lytsite.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">support@lytsite.com</a>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                🌐 <a href="https://www.lytsite.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">www.lytsite.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
