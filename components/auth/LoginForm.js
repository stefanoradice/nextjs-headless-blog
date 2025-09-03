'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm({ closeModal }) {
  const router = useRouter();

  const { login, error, loading, user } = useAuth();

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Login</h2>

      {error?.error && !error?.errors && (
        <p className="text-red-500" dangerouslySetInnerHTML={{ __html: error.error }} />
      )}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={`w-full border p-2 rounded ${error?.username ? 'mb-0' : ''}`}
      />
      {error?.errors?.username && <p className="text-red-500">{error.errors.username[0]}</p>}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`w-full border p-2 rounded ${error?.password ? 'mb-0' : ''}`}
      />
      {error?.errors?.password && <p className="text-red-500">{error.errors.password[0]}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </button>
    </form>
  );
}
