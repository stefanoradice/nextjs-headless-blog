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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
      aria-labelledby="register-title"
    >
      <h2 id="register-title" className="text-xl font-semibold">
        Registrati
      </h2>

      <div>
        <label htmlFor="username" className="block font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          {...register('username', { required: 'Il campo username è obbligatorio' })}
          aria-required="true"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'username-error' : undefined}
          className={`w-full border p-2 rounded ${errors.username ? 'mb-0' : ''}`}
          autoComplete="username"
        />
        {errors.username && (
          <p id="username-error" className="text-red-500" role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          {...register('email', {
            required: "L'email è obbligatoria",
            pattern: { value: /^\S+@\S+$/i, message: 'Formato email non valido' },
          })}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`w-full border p-2 rounded ${errors.email ? 'mb-0' : ''}`}
        />
        {errors.email && (
          <p id="email-error" className="text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block font-medium">
          Password
        </label>
        <Controller
          name="password"
          control={control}
          rules={{ required: 'La password è obbligatoria' }}
          render={({ field }) => (
            <PasswordInput
              id="password"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              ariaRequired="true"
              ariaInvalid={!!errors.password}
              ariaDescribedby={errors.password ? 'password-error' : undefined}
              classes={`w-full border p-2 rounded ${errors.password ? 'mb-0' : ''}`}
              autoComplete="new-password"
            />
          )}
        />
        {errors.password && (
          <p id="password-error" className="text-red-500" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <p className="text-red-500" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Registrati
      </button>
    </form>
  );
}
