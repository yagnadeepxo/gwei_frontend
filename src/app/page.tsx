'use client';

import { useGigs } from "@/hooks/useGigs";
import Link from 'next/link';

export default function Home() {
  const { gigs } = useGigs();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-black">Make ethereum great again</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <Link key={gig._id} href={`/gig/${gig._id}`}>
            <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2 text-black">{gig.title}</h3>
              <p className="text-gray-600 mb-4">{gig.company}</p>
              <p className="text-black">{gig.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
