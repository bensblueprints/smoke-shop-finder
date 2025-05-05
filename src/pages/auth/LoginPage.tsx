import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';
import { Store } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-amber-500 mb-4">
            <Store className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-amber-500 mb-2">
            Smoke Shop Directory
          </h1>
          <p className="text-amber-300/80">
            Sign in to manage your shop listing
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-amber-500/20">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#b45309',
                    brandAccent: '#92400e',
                    inputBackground: 'black',
                    inputText: '#fcd34d',
                    inputBorder: '#78350f',
                    inputBorderFocus: '#f59e0b',
                    inputBorderHover: '#d97706',
                    defaultButtonBackground: '#b45309',
                    defaultButtonBackgroundHover: '#92400e',
                    defaultButtonBorder: '#78350f',
                    defaultButtonText: 'white',
                  },
                  space: {
                    inputPadding: '12px',
                    buttonPadding: '12px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              className: {
                container: 'auth-container',
                label: 'text-amber-500',
                button: 'auth-button',
                divider: 'bg-amber-900',
                anchor: 'text-amber-500 hover:text-amber-400',
              },
            }}
            theme="dark"
            providers={[]}
          />
        </div>

        <p className="text-center mt-6 text-amber-500/60 text-sm">
          Need help? <a href="#" className="text-amber-500 hover:text-amber-400">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;