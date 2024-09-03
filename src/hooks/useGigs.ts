import { useState, useEffect } from 'react';
import axios from 'axios';
import { Gig } from '@/models/gig';
export const useGigs = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);

  const fetchGigs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/gigs');
      setGigs(response.data);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    }
  };

  const createGig = async (gigData: Gig) => {
    try {
      const response = await axios.post('http://localhost:3001/api/gigs', gigData);
      setGigs(prevGigs => [...prevGigs, response.data]);
    } catch (error) {
      console.error('Error creating gig:', error);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  return { gigs, createGig };
};
