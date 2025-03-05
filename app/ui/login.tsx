"use client";

import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { KeyIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ZenLogo from './logo';

export default function LoginPage() {
  const [canvasUrl, setCanvasUrl] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // If the input fields are empty throw an error
      if (!canvasUrl || !apiToken) {
        throw new Error('Please fill all fields');
      }

      // Clean URL
      const cleanUrl = canvasUrl
        .trim()
        .replace(/^(https?:\/\/)/, "")
        .replace(/\/+$/, "");

      // Test API call to verify credentials
      const testResponse = await fetch('/api/verify-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          canvasUrl: cleanUrl,
          apiToken,
        }),
      });

      if (!testResponse.ok) {
        throw new Error('Invalid credentials');
      }

      // Store credentials in localStorage (temporarily)
      localStorage.setItem('canvasCredentials', JSON.stringify({
        cleanUrl,
        apiToken,
      }));

      // If credentials are correct redirect to Homepage
      router.push('/');
    } catch (err) {
      // Else, Invalid credentials return an error
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center bg-[#dee2e6] relative">
      <div className='flex w-full justify-center divide-x-2 gap-16'>

        {/* Logo */}
        <div className='flex-col relative -mt-14'>
          < ZenLogo width={600} height={600} />
          <div className='absolute bottom-16 w-full flex justify-evenly font-serif'>
            <p className='text-center text-2xl'>Simple</p>
            <p className='text-center text-2xl'>Elegant</p>
            <p className='text-center text-2xl'>Zen</p>
          </div>
        </div>
        {/* Login Form */}
        <div className='py-10 px-24'>
          <form
            onSubmit={handleLogin}
            className="px-10 py-12 space-y-6 mx-auto my-auto w-[400px] h-[500px] bg-slate-50 rounded-tl-[20px] 
                      rounded-tr-[100px] rounded-br-[20px] rounded-bl-[100px] shadow-[10px_10px_21px_-6px_rgba(0,0,0,0.2)] 
                      relative z-10">

            {/* Greetings */}
            <h1 className="mb-8 text-center font-semibold text-3xl">Welcome!</h1>

            {/* Canvas URL Field */}
            <div>
              <label className="block mb-2 ml-1">Canvas URL Field</label>
              {/* Relative parent container */}
              <div className='relative'>
                {/* Input with extra left padding */}
                <input
                  value={canvasUrl}
                  onChange={(e) => setCanvasUrl(e.target.value)}
                  placeholder="your-school.instructure.com"
                  className="h-12 pl-10 pr-4 border border-neutral-400 w-full rounded-2xl outline-none transition-colors duration-300 focus:border-stone-900 focus:ring-stone-900"
                  required
                />
                {/* Icon positioned absolutely */}
                <GlobeAltIcon
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400'
                />
              </div>
            </div>

            {/* API Token Field */}
            <div>
              <label className="block mb-2 ml-1">API Token</label>

              {/* Relative parent container */}
              <div className="relative">
                {/* Input with extra left padding */}
                <input
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  className='h-12 pl-10 pr-4 w-full rounded-2xl border border-neutral-400 outline-none transition-colors duration-300 focus:border-stone-900 focus:ring-stone-900'
                  required
                />
                {/* Icon positioned absolutely */}
                <KeyIcon
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400'
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Sign In Button */}
            <div className="flex w-full justify-center">
              <button
                type="submit"
                className="h-12 mt-1 py-2 px-7 border border-transparent rounded-2xl shadow-sm text-base font-medium text-white bg-stone-800 hover:bg-stone-900"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}