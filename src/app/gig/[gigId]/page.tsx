'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken'

import { Gig } from '@/models/gig';

const GigDetails = () => {
  const params = useParams();
  const router = useRouter();
  const gigId = params.gigId as string;
  const [gig, setGig] = useState<Gig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (gigId) {
      axios.get(`http://localhost:3001/api/getGigById/${gigId}`)
        .then(response => setGig(response.data))
        .catch(error => console.error('Error fetching gig:', error));
    }

    // Check if user is logged in and token is valid
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        if (decodedToken && typeof decodedToken !== 'string' && decodedToken.exp) {
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [gigId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      await axios.post(`http://localhost:3001/api/${gigId}/submissions`, 
        { link: submissionLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Submission successful!');
      setShowModal(false);
      setSubmissionLink('');
    } catch (error) {
      console.error('Error submitting:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        alert('Error submitting. Please try again.');
      }
    }
  };

  const handleSubmitClick = () => {
    if (isLoggedIn) {
      setShowModal(true);
    } else {
      router.push('/login');
    }
  };

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
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Skills Required</h2>
        <ul className="list-disc list-inside">
          {gig.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleSubmitClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Submit your work</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="url"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                placeholder="Enter HTTPS link"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetails;
