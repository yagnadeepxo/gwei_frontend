import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white text-black text-[20px] leading-none font-mono font-bold">
      <div className="max-w-7xl mx-auto px-1">
        <div className="flex justify-center h-6 space-x-20">
          {['About', 'Contact', 'Privacy'].map((item) => (
            <a
              key={item}
              href="#"
              className="inline-flex items-center px-2 underline"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      <div className="text-center py-1">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
}
