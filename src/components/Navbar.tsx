import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-white text-black text-[20px] leading-none font-mono font-bold">
      <div className="max-w-7xl mx-auto px-1">
        <div className="flex justify-center h-6 space-x-20">
          {[
            { name: 'Home', path: '/' },
            { name: 'Login', path: '/login' },
            { name: 'Register', path: '/register' }
          ].map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="inline-flex items-center underline"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
