// BusinessRegister.tsx
import React from 'react';
import { useRegisterBusiness } from '@/hooks/useBusinessRegister';

const BusinessRegister = () => {
  const { register, handleSubmit, errors, onSubmit } = useRegisterBusiness();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Business Register</h2>
        
        <div className="mb-4">
          <input 
            type="text" 
            {...register('name')} 
            placeholder="Business Name" 
            className="w-full px-3 py-2 border border-black rounded text-black placeholder-gray-500"
          />
          {errors.name && <p className="text-black text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <input 
            type="email" 
            {...register('email')} 
            placeholder="Email" 
            className="w-full px-3 py-2 border border-black rounded text-black placeholder-gray-500"
          />
          {errors.email && <p className="text-black text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <input 
            type="password" 
            {...register('password')} 
            placeholder="Password" 
            className="w-full px-3 py-2 border border-black rounded text-black placeholder-gray-500"
          />
          {errors.password && <p className="text-black text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default BusinessRegister;
