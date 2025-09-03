'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import PasswordInput from './PasswordInput';

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function RegisterForm({ redirect, closeModal }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Errore generico');
      const success = await login(data.username, data.password);
      if (success) {
        closeModal && closeModal();
      }
      router.push(redirect);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Registrati</h2>
      <input
        {...register('username')}
        className={`w-full border p-2 rounded ${error?.username ? 'mb-0' : ''}`}
        placeholder="Username"
      />
      {errors.username && <p className="text-red-500">username {errors.username.message}</p>}
      <input
        {...register('email')}
        className={`w-full border p-2 rounded ${error?.email ? 'mb-0' : ''}`}
        type="email"
        placeholder="Email"
      />
      {errors.email && <p className="text-red-500">email {errors.email.message}</p>}
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <PasswordInput
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            classes={`w-full border p-2 rounded ${error?.password ? 'mb-0' : ''}`}
          />
        )}
      />
      {errors.password && <p className="text-red-500">password {errors.password.message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-auto"
      >
        Registrati
      </button>
    </form>
  );
}
