import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, X } from 'lucide-react';

interface PasswordProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (password: string) => void;
  currentPassword?: string;
}

export function PasswordProtectionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentPassword 
}: PasswordProtectionModalProps) {
  const [password, setPassword] = useState(currentPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!password.trim()) return;
    
    setIsLoading(true);
    try {
      await onSave(password);
      onClose();
    } catch (error) {
      console.error('Failed to set password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await onSave(''); // Empty password removes protection
      onClose();
    } catch (error) {
      console.error('Failed to remove password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-cyan-600 mr-2" />
            <h3 className="text-lg font-semibold">Password Protection</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          {currentPassword 
            ? 'Update or remove password protection for this link.'
            : 'Set a password to protect this link from unauthorized access.'
          }
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a secure password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          {currentPassword && (
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
            >
              Remove Protection
            </button>
          )}
          
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!password.trim() || isLoading}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-md disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              {currentPassword ? 'Update' : 'Set'} Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
