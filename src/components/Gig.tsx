import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGigs } from '../hooks/useGigs';
import { Gig } from '@/models/gig';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const gigSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  guidelines: z.string().min(1, 'Guidelines are required'),
  evaluationCriteria: z.string().min(1, 'Evaluation criteria is required'),
  bounty: z.number().positive('Bounty must be a positive number'),
  breakdown: z.string().min(1, 'Bounty breakdown is required'),
  contact: z.string().email('Contact must be a valid email'),
  skills: z.string().min(1, 'At least one skill is required'),
});

type GigFormData = z.infer<typeof gigSchema>;

const GigForm: React.FC = () => {
  const { createGig } = useGigs();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<GigFormData>({
    resolver: zodResolver(gigSchema),
  });
  const router = useRouter();
  const params = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwt.decode(token);
          if (decodedToken && typeof decodedToken !== 'string' && decodedToken.exp) {
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp > currentTime) {
              setIsLoggedIn(true);
              setCompanyName(params.companyName as string);
            } else {
              setIsLoggedIn(false);
              localStorage.removeItem('token');
              router.push('/business/login');
            }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          router.push('/business/login');
        }
      } else {
        setIsLoggedIn(false);
        router.push('/business/login');
      }
    };

    checkLoginStatus();
  }, [router, params.companyName]);

  const onSubmit = async (data: GigFormData) => {
    if (!isLoggedIn || !companyName) {
      alert('Please log in to create a gig');
      router.push('/business/login');
      return;
    }

    const formattedData = new Gig({
      ...data,
      company: companyName,
      deadline: new Date(data.deadline),
      bounty: parseFloat(data.bounty.toString()),
      skills: data.skills.split(',').map(skill => skill.trim()),
    });

    try {
      await createGig(formattedData);
      alert('Gig created successfully');
      router.push(`/${companyName}/dashboard`);
    } catch (error) {
      console.error('Error creating gig:', error);
      alert('Failed to create gig. Please try again.');
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('skills', e.target.value);
  };

  if (!isLoggedIn || !companyName) {
    return null; // Return null as the useEffect will handle the redirect
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8 space-y-6">
      <div>
        <label className="block mb-2 text-sm font-bold text-black">Title</label>
        <input {...register('title')} className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
        {errors.title && <p className="mt-1 text-sm text-black">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-black">Description</label>
        <textarea {...register('description')} className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
        {errors.description && <p className="mt-1 text-sm text-black">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-black">Deadline</label>
        <input type="date" {...register('deadline')} className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
        {errors.deadline && <p className="mt-1 text-sm text-black">{errors.deadline.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-black">Guidelines</label>
        <textarea {...register('guidelines')} className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
        {errors.guidelines && <p className="mt-1 text-sm text-black">{errors.guidelines.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-black">Evaluation Criteria</label>
        <textarea 
          {...register('evaluationCriteria')} 
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
        />
        {errors.evaluationCriteria && <p className="mt-1 text-sm text-black">{errors.evaluationCriteria.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-black">Bounty</label>
        <input 
          type="number" 
          step="0.01"
          {...register('bounty', { valueAsNumber: true })} 
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
        />
        {errors.bounty && <p className="mt-1 text-sm text-black">{errors.bounty.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-black">Bounty Breakdown</label>
        <textarea 
          {...register('breakdown')} 
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
        />
        {errors.breakdown && <p className="mt-1 text-sm text-black">{errors.breakdown.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-black">Contact</label>
        <input type="email" {...register('contact')} className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
        {errors.contact && <p className="mt-1 text-sm text-black">{errors.contact.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-black">Skills (comma-separated)</label>
        <input 
          type="text" 
          {...register('skills')} 
          onChange={handleSkillsChange}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
        />
        {errors.skills && <p className="mt-1 text-sm text-black">{errors.skills.message}</p>}
      </div>

      <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:shadow-outline">
        Create Gig
      </button>
    </form>
  );
};

export default GigForm;
