import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigate?: (page: string) => void;
}

const PrivacyPolicy = ({ onNavigate }: PrivacyPolicyProps) => {
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
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last Updated: 10-09-2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Lytsite ("we," "our," "us") is committed to protecting your privacy and ensuring you have a positive experience when using our services. This Privacy Policy explains how we collect, use, store, and share your information when you use our website, platform, and related services (collectively, the "Services").
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">We may collect the following types of information:</p>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Personal Information You Provide:</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Name, email address, phone number, payment details, and billing information.</li>
                <li>Files, documents, images, and other content you upload or share using Lytsite.</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Automatically Collected Information:</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>IP address, browser type, device type, operating system, and access times.</li>
                <li>Usage data such as pages visited, links clicked, and interactions within the platform.</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Third-Party Information:</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Data we receive from payment providers (e.g., Razorpay, Stripe) for billing verification.</li>
                <li>Analytics or marketing tools (e.g., Google Analytics) for improving our Services.</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Provide, operate, and maintain Lytsite services.</li>
              <li>Deliver and personalize file delivery pages, galleries, and templates.</li>
              <li>Process payments and provide invoices/receipts.</li>
              <li>Improve security, troubleshoot issues, and optimize performance.</li>
              <li>Send important communications (transactional emails, updates, policy changes).</li>
              <li>Provide customer support.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. How We Share Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">We do not sell or rent your personal data. We may share your information only in these limited circumstances:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>With Service Providers:</strong> (e.g., hosting partners, payment processors, analytics providers) under strict confidentiality agreements.</li>
              <li><strong>For Legal Compliance:</strong> When required by law, regulation, legal process, or enforceable governmental request.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred with proper notice.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Retention</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Files uploaded to Lytsite are stored temporarily for the duration set by the user or as per plan limits.</li>
              <li>Personal data (account info, payment records) is retained as long as your account is active or required for legal/accounting purposes.</li>
              <li>You may request deletion of your account and associated data at any time by contacting us.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Security of Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">We implement industry-standard measures to protect your data, including:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Encryption (in transit and at rest).</li>
              <li>Secure file storage and delivery via CDN.</li>
              <li>Access controls and authentication.</li>
              <li>Regular monitoring for vulnerabilities.</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              However, no system is 100% secure. We encourage you to also safeguard your credentials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Depending on your location, you may have rights under data protection laws (GDPR, CCPA, etc.), including:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Right to access, update, or delete your personal data.</li>
              <li>Right to request a copy of your stored information.</li>
              <li>Right to withdraw consent for marketing communications.</li>
              <li>Right to restrict or object to data processing.</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Requests can be made by contacting <a href="mailto:privacy@lytsite.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">privacy@lytsite.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Lytsite is not intended for individuals under 13 (or the minimum age in your jurisdiction). We do not knowingly collect personal data from children. If you believe a child has provided us information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Your data may be transferred and processed outside your country of residence. We ensure appropriate safeguards (such as Standard Contractual Clauses or equivalent) are in place.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. If significant changes are made, we will notify you via email or platform notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              For any questions, concerns, or requests related to this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                📧 <a href="mailto:privacy@lytsite.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">privacy@lytsite.com</a>
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

export default PrivacyPolicy;
