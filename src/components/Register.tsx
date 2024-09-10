import React from 'react';
import { useRegister } from '../hooks/useRegister';

const Register: React.FC = () => {
  const { register, handleSubmit, errors, onSubmit } = useRegister();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-80 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 font-mono">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">Register</h2>
          
          <div>
            <label htmlFor="username" className="block text-sm font-bold mb-2">Username:</label>
            <input
              type="text"
              id="username"
              {...register('username')}
              className="w-full px-3 py-2 border-2 border-black focus:outline-none"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full px-3 py-2 border-2 border-black focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="w-full px-3 py-2 border-2 border-black focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="inline-block font-bold text-black underline hover:no-underline focus:outline-none"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
