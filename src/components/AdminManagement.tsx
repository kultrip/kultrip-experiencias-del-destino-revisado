import React, { useState } from 'react';
import { Shield, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminManagementProps {
  onClose: () => void;
}

export function AdminManagement({ onClose }: AdminManagementProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Step 1: Create the user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'admin'
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Step 2: Update the user profile to admin role
        const { error: updateError } = await supabase.rpc('update_user_role', {
          target_user_id: data.user.id,
          new_role: 'admin'
        });

        if (updateError) throw updateError;

        setMessage('Admin user created successfully! They will need to verify their email.');
        setEmail('');
        setPassword('');
        setName('');
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Create Admin User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={createAdminUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700' 
                : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              'Creating...'
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Admin User
              </>
            )}
          </button>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium text-sm text-gray-900 mb-2">Note:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Admin users can manage experiences and view all bookings</li>
            <li>• They will receive an email verification link</li>
            <li>• Only existing admins can create new admin users</li>
          </ul>
        </div>
      </div>
    </div>
  );
}