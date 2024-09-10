'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Gig {
  _id: string;
  title: string;
  company: string;
  description: string;
  deadline: string;
  guidelines: string;
  evaluationCriteria: string;
  bounty: number;
  breakdown: string;
  contact: string;
  skills: string[];
}

interface Submission {
  _id: string;
  gigId: string;
  link: string;
  username: string;
  email: string;
  createdAt: string;
}

const GigDetails = () => {
  const params = useParams();
  const gigId = params.gigId as string;
  const [gig, setGig] = useState<Gig | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (gigId) {
      axios.get(`http://localhost:3001/api/getGigById/${gigId}`)
        .then(response => setGig(response.data))
        .catch(error => console.error('Error fetching gig:', error));

      axios.get(`http://localhost:3001/api/submissions/${gigId}`)
        .then(response => setSubmissions(response.data))
        .catch(error => console.error('Error fetching submissions:', error));
    }
  }, [gigId]);

  if (!gig) {
    return <div className="font-mono text-center p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white font-mono p-8">
      <div className="max-w-3xl mx-auto bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
        <h1 className="text-3xl font-bold mb-6 border-b-2 border-black pb-2">{gig.title}</h1>
        <div className="space-y-4">
          <p><strong>Company:</strong> {gig.company}</p>
          <p><strong>Description:</strong> {gig.description}</p>
          <p><strong>Deadline:</strong> {new Date(gig.deadline).toLocaleDateString()}</p>
          <p><strong>Guidelines:</strong> {gig.guidelines}</p>
          <p><strong>Evaluation Criteria:</strong> {gig.evaluationCriteria}</p>
          <p><strong>Bounty:</strong> ${gig.bounty}</p>
          <p><strong>Breakdown:</strong> {gig.breakdown}</p>
          <p><strong>Contact:</strong> {gig.contact}</p>
          <p><strong>Skills:</strong> {gig.skills.join(', ')}</p>
        </div>
        <h2 className="text-2xl font-bold mt-8 mb-4 border-b-2 border-black pb-2">Submissions</h2>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission._id} className="border-2 border-black p-4">
              <p><strong>Submission ID:</strong> {submission._id}</p>
              <p><strong>Link:</strong> <a href={submission.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.link}</a></p>
              <p><strong>Username:</strong> {submission.username}</p>
              <p><strong>Email:</strong> {submission.email}</p>
              <p><strong>Created At:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
