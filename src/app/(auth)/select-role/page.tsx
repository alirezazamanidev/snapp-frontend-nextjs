'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CallApi } from '@/libs/helpers/callApi';

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'driver' | null>(null);
  const router = useRouter();

  const handleRoleSelect = (role: 'user' | 'driver') => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if(!selectedRole) return;
    try {
      const res = await CallApi().patch('/user/select-role', {
        role: selectedRole,
      });
      if(res.status === 200) {
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Choose Your Role</h1>
          <p className="text-gray-400 text-lg">Are you a passenger or a driver?</p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          {/* Passenger Card */}
          <div
            onClick={() => handleRoleSelect('user')}
            className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedRole === 'user'
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                selectedRole === 'user' ? 'bg-blue-500' : 'bg-gray-700'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Passenger</h3>
                <p className="text-gray-400 text-sm">Book rides and reach your destination</p>
              </div>
              {selectedRole === 'user' && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Driver Card */}
          <div
            onClick={() => handleRoleSelect('driver')}
            className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedRole === 'driver'
                ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/25'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                selectedRole === 'driver' ? 'bg-green-500' : 'bg-gray-700'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6H4L2 4h2.5L7 14h8l4-8H7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Driver</h3>
                <p className="text-gray-400 text-sm">Earn money by providing rides to passengers</p>
              </div>
              {selectedRole === 'driver' && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
              selectedRole
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>You can change your role later</p>
        </div>
      </div>
    </div>
  );
}