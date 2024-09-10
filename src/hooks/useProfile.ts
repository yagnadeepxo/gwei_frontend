import { useState, useEffect } from 'react';
import axios from 'axios';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const username = decodedToken.username;

        const response = await axios.get(`http://localhost:3001/api/${username}`);
        setProfile(response.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchProfile();
  }, []);

  return { profile, error };
};

export default useProfile;