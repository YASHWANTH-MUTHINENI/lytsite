import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ArrowLeft, CreditCard, Settings, Clock, Mail, Building, User } from 'lucide-react';
import Navbar from './Navbar';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [showForm, setShowForm] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          {/* Payment Integration Card */}
          <Card className="shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-10 h-10 text-orange-600 animate-spin" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Payment Integration
                </h1>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-semibold text-yellow-800">Work in Progress</span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    We're currently working on integrating secure payment processing
                  </p>
                </div>

                <p className="text-lg text-gray-600 mb-8">
                  Our team is currently working on implementing a secure and seamless payment integration. 
                  This feature will be available soon to upgrade your account to Pro.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-blue-900 mb-3">What's Coming:</h3>
                  <ul className="text-left text-blue-800 space-y-2">
                    <li className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Secure payment processing
                    </li>
                    <li className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Multiple payment methods
                    </li>
                    <li className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Instant account upgrades
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Contact Sales for Business Plan
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Return to Homepage
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  Want to be notified when payment integration is ready? 
                  <br />
                  <a 
                    href="#" 
                    onClick={() => navigate('/feedback')} 
                    className="text-primary hover:underline font-medium"
                  >
                    Leave your feedback here
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Sales Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-lg mx-auto shadow-2xl">
                <CardContent className="p-8">
                  {!submitted ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Contact Sales</h3>
                        <button
                          onClick={() => setShowForm(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Full Name
                          </label>
                          <Input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address
                          </label>
                          <Input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Building className="w-4 h-4 inline mr-2" />
                            Company Name
                          </label>
                          <Input
                            type="text"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Enter your company name"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message
                          </label>
                          <Textarea
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us about your business needs and requirements..."
                            className="w-full min-h-[100px]"
                          />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">Business Plan Benefits:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• 100 GB upload size</li>
                            <li>• 2 TB bandwidth/month</li>
                            <li>• White-label + custom domain</li>
                            <li>• Full analytics + API access</li>
                            <li>• Unlimited team members</li>
                            <li>• Priority support + SLA</li>
                          </ul>
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                          Send Message
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Message Sent! 📧
                      </h3>
                      <p className="text-gray-600">
                        Thank you for your interest in our Business plan. Our sales team will contact you within 24 hours.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;