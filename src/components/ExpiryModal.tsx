import React, { useState } from 'react';
import { Clock, Calendar, X } from 'lucide-react';

interface ExpiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expiryDate: string | null) => void;
  currentExpiry?: string;
}

const EXPIRY_OPTIONS = [
  { label: '1 Hour', value: 1, unit: 'hours' },
  { label: '6 Hours', value: 6, unit: 'hours' },
  { label: '1 Day', value: 1, unit: 'days' },
  { label: '3 Days', value: 3, unit: 'days' },
  { label: '1 Week', value: 7, unit: 'days' },
  { label: '2 Weeks', value: 14, unit: 'days' },
  { label: '1 Month', value: 30, unit: 'days' },
  { label: 'Custom', value: 'custom', unit: 'custom' },
];

export function ExpiryModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentExpiry 
}: ExpiryModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>('1');
  const [customDate, setCustomDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const calculateExpiryDate = (value: number, unit: string): string => {
    const now = new Date();
    if (unit === 'hours') {
      now.setHours(now.getHours() + value);
    } else if (unit === 'days') {
      now.setDate(now.getDate() + value);
    }
    return now.toISOString();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let expiryDate: string | null = null;
      
      if (selectedOption === 'custom') {
        if (!customDate) return;
        expiryDate = new Date(customDate).toISOString();
      } else if (selectedOption !== 'never') {
        const option = EXPIRY_OPTIONS.find(opt => opt.value.toString() === selectedOption);
        if (option && typeof option.value === 'number') {
          expiryDate = calculateExpiryDate(option.value, option.unit);
        }
      }
      
      await onSave(expiryDate);
      onClose();
    } catch (error) {
      console.error('Failed to set expiry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await onSave(null);
      onClose();
    } catch (error) {
      console.error('Failed to remove expiry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrentExpiry = (expiry: string): string => {
    const date = new Date(expiry);
    return date.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-cyan-600 mr-2" />
            <h3 className="text-lg font-semibold">Auto-Expiry Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentExpiry && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Current expiry:</strong> {formatCurrentExpiry(currentExpiry)}
            </p>
          </div>
        )}

        <p className="text-gray-600 mb-4">
          Set when this link should automatically expire and become inaccessible.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Time
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="expiry"
                value="never"
                checked={selectedOption === 'never'}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              Never expire
            </label>
            
            {EXPIRY_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="expiry"
                  value={option.value.toString()}
                  checked={selectedOption === option.value.toString()}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {selectedOption === 'custom' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Date & Time
            </label>
            <input
              type="datetime-local"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        )}

        <div className="flex justify-between gap-3">
          {currentExpiry && (
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
            >
              Remove Expiry
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
              disabled={isLoading || (selectedOption === 'custom' && !customDate)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-md disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Set Expiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
