'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm({ closeModal }) {
  const router = useRouter();

  const { login, error, loading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(username, password);
      if (success) {
        closeModal && closeModal();
      }
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto"
      aria-labelledby="login-title"
    >
      <h2 id="login-title" className="text-xl font-semibold">
        Login
      </h2>

      {error?.error && !error?.errors && (
        <p
          className="text-red-500"
          role="alert"
          dangerouslySetInnerHTML={{ __html: error.error }}
        />
      )}

      <div>
        <label htmlFor="username" className="block font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!error?.errors?.username}
          aria-describedby={error?.errors?.username ? 'username-error' : undefined}
          className={`w-full border p-2 rounded ${error?.errors?.username ? 'mb-0' : ''}`}
          autoComplete="username"
        />
        {error?.errors?.username && (
          <p id="username-error" className="text-red-500" role="alert">
            {error.errors.username[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!error?.errors?.password}
          aria-describedby={error?.errors?.password ? 'password-error' : undefined}
          className={`w-full border p-2 rounded ${error?.errors?.password ? 'mb-0' : ''}`}
          autoComplete="current-password"
        />
        {error?.errors?.password && (
          <p id="password-error" className="text-red-500" role="alert">
            {error.errors.password[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </button>
    </form>
  );
}
