'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { z } from 'zod';
import useProfile from '../hooks/useProfile';
import { jwtDecode } from "jwt-decode";

const profileSchema = z.object({
  About: z.string().min(1, "About is required"),
  skills: z.string().min(1, "Skills are required"),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal('')),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  linkedIn: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const CreateProfile: React.FC = () => {
  const router = useRouter();
  const { profile, error } = useProfile();
  const [formData, setFormData] = useState<ProfileFormData>({
    About: '',
    skills: '',
    twitter: '',
    github: '',
    linkedIn: '',
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthenticationAndFetchProfile = async () => {
      const token = localStorage.getItem('user_token');
      if (!token) {
        router.push('/login');
      } else {
        try {
          const decodedToken: any = jwtDecode(token);
          const username = decodedToken.username;
          const response = await axios.get(`http://localhost:3001/api/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data) {
            setFormData({
              About: response.data.About || '',
              skills: response.data.skills || '',
              twitter: response.data.twitter || '',
              github: response.data.github || '',
              linkedIn: response.data.linkedIn || '',
            });
            setIsUpdating(true);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuthenticationAndFetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = profileSchema.parse(formData);
      const token = localStorage.getItem('user_token');
      if (!token) {
        throw new Error('No token found');
      }

      let response;
      if (isUpdating) {
        response = await axios.patch(`http://localhost:3001/api/update`, validatedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(`http://localhost:3001/api/profile`, validatedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        alert(isUpdating ? 'Profile updated successfully' : 'Profile created successfully');
      } else {
        throw new Error(isUpdating ? 'Failed to update profile' : 'Failed to create profile');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<ProfileFormData>);
      } else if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          console.error('Error updating/creating profile: Forbidden');
          alert('Failed to update/create profile: You do not have permission');
        } else {
          console.error('Error updating/creating profile:', error.message);
          alert(`Failed to update/create profile: ${error.message}`);
        }
      } else {
        console.error('Error updating/creating profile:', error);
        alert('Failed to update/create profile');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  /*if (error) {
    return <div>Error: {error}</div>;
  }*/

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-96 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 font-mono">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="About" className="block text-sm font-bold mb-2">About:</label>
            <textarea
              id="About"
              name="About"
              value={formData.About}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-black focus:outline-none"
              required
            />
            {errors.About && <p className="text-red-500 text-xs mt-1">{errors.About}</p>}
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-bold mb-2">Skills:</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-black focus:outline-none"
              required
            />
            {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
          </div>
          <div>
            <label htmlFor="twitter" className="block text-sm font-bold mb-2">Twitter:</label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-black focus:outline-none"
            />
            {errors.twitter && <p className="text-red-500 text-xs mt-1">{errors.twitter}</p>}
          </div>
          <div>
            <label htmlFor="github" className="block text-sm font-bold mb-2">GitHub:</label>
            <input
              type="text"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-black focus:outline-none"
            />
            {errors.github && <p className="text-red-500 text-xs mt-1">{errors.github}</p>}
          </div>
          <div>
            <label htmlFor="linkedIn" className="block text-sm font-bold mb-2">LinkedIn:</label>
            <input
              type="text"
              id="linkedIn"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-black focus:outline-none"
            />
            {errors.linkedIn && <p className="text-red-500 text-xs mt-1">{errors.linkedIn}</p>}
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="inline-block font-bold text-black underline hover:no-underline focus:outline-none"
            >
              {isUpdating ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;