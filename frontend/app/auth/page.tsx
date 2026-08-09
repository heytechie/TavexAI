'use client';

import { auth, googleProvider } from '@/utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import React from 'react';
import { api } from '@/utils/axios';
const Page = () => {
  const handleLogin = async (token: string) => {
    try {
      const res = await api.post("/auth/login", {
        token
      }, {
        withCredentials: true
      })
    } catch (err) {
      console.error(err);
    }
  }

  const googleLogin = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      console.log(data);
      const token = await data.user.getIdToken();
      handleLogin(token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <button
        onClick={googleLogin}
        className='bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors'
      >
        Continue with Google
      </button>
    </div>
  );
};

export default Page;

