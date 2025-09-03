'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

import Menu from './Menu';
import RegisterForm from '../auth/RegisterForm';
import LoginForm from '../auth/LoginForm';

export default function Header({ initialUser = null }) {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState();
  const [isClosing, setIsClosing] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const openModal = (view) => {
    setIsModalOpen(view);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setAnimateIn(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    if (isModalOpen) {
      requestAnimationFrame(() => {
        setAnimateIn(true);
      });
    }
  }, [isModalOpen]);

  return (
    <>
      <header className="w-full border-b">
        <div className="bg-gray-100 text-sm py-2 px-4 flex justify-end">
          {user ? (
            <>
              <button className="text-blue-600 hover:underline" onClick={logout}>
                Logout
              </button>
              <Link className="ml-2 text-blue-600 hover:underline" href={'/dashboard'}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <button
                className="text-blue-600 hover:underline mr-2"
                onClick={() => openModal('login')}
              >
                Login
              </button>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => openModal('register')}
              >
                Registrati
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-4 bg-white">
          <div className="text-xl font-bold text-gray-800">
            <Link href={'/'}>MyLogo</Link>
          </div>

          <Menu />
        </div>
      </header>

      {isModalOpen && (
        <div
          className={`
          fixed inset-0 z-50 flex items-center justify-center bg-black/50
          transition-opacity duration-300
          ${isClosing ? 'opacity-0' : 'opacity-100'}
        `}
        >
          <div
            className={`
              bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative transform transition-all duration-300
              ${animateIn && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Chiudi"
            >
              &times;
            </button>
            {isModalOpen === 'login' ? (
              <LoginForm closeModal={closeModal} />
            ) : (
              <RegisterForm redirect={'/dashboard'} closeModal={closeModal} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
