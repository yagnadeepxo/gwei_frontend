'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { Gig } from '@/models/gig';

const GigDetails = () => {
  const params = useParams();
  const gigId = params.gigId as string;
  const [gig, setGig] = useState<Gig | null>(null);

  useEffect(() => {
    if (gigId) {
      axios.get(`http://localhost:3001/api/gigs/${gigId}`)
        .then(response => setGig(response.data))
        .catch(error => console.error('Error fetching gig:', error));
    }
  }, [gigId]);

  if (!gig) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-black">{gig.title}</h1>
      <p className="text-gray-600 mb-4">Company: {gig.company}</p>
      <p className="text-gray-600 mb-4">Description: {gig.description}</p>
      <p className="text-gray-600 mb-4">Deadline: {new Date(gig.deadline).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-4">Contact: {gig.contact}</p>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Bounty</h2>
        <p>Total: ${gig.bounty}</p>
        <p>Breakdown: {gig.breakdown}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Guidelines</h2>
        <p>{gig.guidelines}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Evaluation Criteria</h2>
        <p>{gig.evaluationCriteria}</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Skills Required</h2>
        <ul className="list-disc list-inside">
          {gig.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GigDetails;
