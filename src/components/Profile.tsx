import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Twitter, Github, Linkedin } from 'lucide-react';

interface Profile {
  username: string;
  About: string;
  skills: string;
  twitter: string;
  github: string;
  linkedIn: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('user_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const username = decodedToken.username;

        const response = await axios.get(`http://localhost:3001/api/${username}`);
        setProfile(response.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchProfile();
  }, [router]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-80 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 font-mono">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2">{profile.username}</h2>
          <p className="text-sm">{profile.About}</p>
          <div>
            <h3 className="font-bold mb-1">Skills:</h3>
            <p className="text-sm">{profile.skills}</p>
          </div>
          <div className="flex justify-between pt-4">
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-500">
              <Twitter size={24} />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
              <Github size={24} />
            </a>
            <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-700">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
