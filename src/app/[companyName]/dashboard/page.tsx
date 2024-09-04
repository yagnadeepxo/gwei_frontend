'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const Dashboard = () => {
  const params = useParams();
  const router = useRouter();
  const companyName = params.companyName as string;
  const [companyNameState, setCompanyNameState] = useState<string | null>(null);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    if (companyName) {
      axios.get(`http://localhost:3001/api/businesses/${companyName}`)
        .then(response => setCompanyNameState(response.data.name))
        .catch(error => console.error('Error fetching company name:', error));

      axios.get(`http://localhost:3001/api/gigs/${companyName}`)
        .then(response => setGigs(response.data))
        .catch(error => console.error('Error fetching gigs:', error));
    }
  }, [companyName]);

  if (!companyNameState) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav className="border-b mb-4">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href={`/${companyName}/createGig`}>
            <button className="px-4 py-2 border rounded">Create Gig</button>
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Dashboard for {companyNameState}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gigs.map((gig: any) => (
            <div key={gig._id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{gig.title}</h2>
              <p className="text-gray-600 mb-2">{gig.description}</p>
              <p className="text-sm text-gray-500">Pay: ${gig.bounty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
