
import React from 'react';
import { useLogin } from '../hooks/useLogin';

const Login: React.FC = () => {
  const { register, handleSubmit, errors, onSubmit } = useLogin();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input type="email" {...register('email')} className="w-full px-3 py-2 border rounded" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input type="password" {...register('password')} className="w-full px-3 py-2 border rounded" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
