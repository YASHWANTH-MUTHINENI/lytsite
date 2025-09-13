import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onNavigate?: (page: string) => void;
}

const TermsOfService = ({ onNavigate }: TermsOfServiceProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => onNavigate?.('homepage')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last Updated: 10-09-2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Welcome to Lytsite! These Terms of Service ("Terms") govern your use of the Lytsite website, applications, and services ("Services"). By creating an account or using our Services, you agree to these Terms. If you do not agree, please do not use Lytsite.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Eligibility</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You must be at least 13 years old (or the legal age in your jurisdiction) to use Lytsite.</li>
              <li>By using our Services, you represent that you have the authority to enter into this agreement.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Services Provided</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Lytsite allows users to:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Upload, store, and share files via branded mini-sites.</li>
              <li>Use templates for file delivery, galleries, resumes, and portfolios.</li>
              <li>Access additional features under paid subscription plans.</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              We reserve the right to modify, suspend, or discontinue Services at any time with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Accounts and Security</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to notify us immediately of any unauthorized access.</li>
              <li>We are not liable for any loss arising from unauthorized access due to your failure to secure your account.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Upload, share, or distribute files that are illegal, harmful, infringing, or violate the rights of others.</li>
              <li>Use Lytsite to transmit malware, spam, or malicious content.</li>
              <li>Attempt to disrupt or overload our systems (e.g., DDoS, abuse of bandwidth).</li>
              <li>Reverse-engineer or attempt to gain unauthorized access to our Services.</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Violation may result in account suspension or termination without refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. File Storage & Delivery</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Files uploaded to Lytsite are stored temporarily and may expire after the period set by your subscription plan.</li>
              <li>We do not guarantee permanent storage or backup of files.</li>
              <li>Users are responsible for keeping copies of their own files.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Paid Plans & Billing</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Lytsite offers Free, Standard, Pro, and Business subscription tiers.</li>
              <li>By subscribing, you authorize us (and our payment providers such as Razorpay or Stripe) to charge you according to the selected plan.</li>
              <li>Fees are billed on a recurring basis (monthly or yearly).</li>
              <li>All payments are non-refundable, except as required by law.</li>
              <li>Failure to pay may result in suspension or termination of your account.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Intellectual Property</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You retain all rights to files and content you upload.</li>
              <li>By using Lytsite, you grant us a limited license to store, process, and display your content as necessary to provide the Services.</li>
              <li>The Lytsite brand, logo, templates, and platform features are owned by us and may not be copied, modified, or redistributed without permission.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Termination</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You may cancel your account at any time.</li>
              <li>We may suspend or terminate your account if you violate these Terms or misuse the Services.</li>
              <li>Upon termination, your access will cease and files may be deleted.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Disclaimer of Warranties</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Lytsite is provided "as is" without warranties of any kind.</li>
              <li>We do not guarantee that Services will be uninterrupted, secure, or error-free.</li>
              <li>We disclaim all liability for any loss of data, delays, or damages resulting from use of the Services.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Lytsite will not be liable for indirect, incidental, or consequential damages.</li>
              <li>Our total liability for any claim shall not exceed the amount paid by you in the last 3 months of your subscription.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update these Terms periodically. Continued use of Lytsite after updates means you accept the revised Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Governing Law & Dispute Resolution</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>These Terms shall be governed by and construed under the laws of India (or the country of Lytsite's registration).</li>
              <li>Disputes shall be resolved in the courts of India, unless otherwise required by law.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              For questions about these Terms, please contact us at:
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

export default TermsOfService;
