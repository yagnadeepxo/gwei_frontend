'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGigs } from '../hooks/useGigs'
import { Gig } from '@/models/gig'
import { useRouter, useParams } from 'next/navigation'

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
})

type GigFormData = z.infer<typeof gigSchema>

const GigForm: React.FC = () => {
  const { createGig } = useGigs()
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<GigFormData>({
    resolver: zodResolver(gigSchema),
  })
  const router = useRouter()
  const params = useParams()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [companyName, setCompanyName] = useState<string | null>(null)

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('business_token')
      if (token) {
        setIsLoggedIn(true)
        setCompanyName(params.companyName as string)
      } else {
        setIsLoggedIn(false)
        router.push('/business/login')
      }
    }

    checkLoginStatus()
  }, [router, params.companyName])

  const onSubmit = async (data: GigFormData) => {
    if (!isLoggedIn || !companyName) {
      alert('Please log in to create a gig')
      router.push('/business/login')
      return
    }

    const formattedData = new Gig({
      ...data,
      company: companyName,
      deadline: new Date(data.deadline),
      bounty: parseFloat(data.bounty.toString()),
      skills: data.skills.split(',').map(skill => skill.trim()),
    })

    try {
      await createGig(formattedData)
      alert('Gig created successfully')
      router.push(`/${companyName}/dashboard`)
    } catch (error) {
      console.error('Error creating gig:', error)
      alert('Failed to create gig. Please try again.')
    }
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('skills', e.target.value)
  }

  if (!isLoggedIn || !companyName) {
    return null // Return null as the useEffect will handle the redirect
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4 font-mono">
      <div className="w-full max-w-2xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
        <h2 className="text-2xl font-bold mb-6 text-black border-b-2 border-black pb-2">Create a New Gig</h2>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] pr-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-bold text-black">Title</label>
              <input id="title" {...register('title')} className="w-full px-3 py-2 text-black border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black" />
              {errors.title && <p className="mt-1 text-sm text-black">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-bold text-black">Description</label>
              <textarea id="description" {...register('description')} className="w-full px-3 py-2 text-black border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black" />
              {errors.description && <p className="mt-1 text-sm text-black">{errors.description.message}</p>}
            </div>

            <div>
              <label htmlFor="deadline" className="block mb-2 text-sm font-bold text-black">Deadline</label>
              <input id="deadline" type="date" {...register('deadline')} className="w-full px-3 py-2 text-black border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black" />
              {errors.deadline && <p className="mt-1 text-sm text-black">{errors.deadline.message}</p>}
            </div>

            <div>
              <label htmlFor="guidelines" className="block mb-2 text-sm font-bold text-black">Guidelines</label>
              <textarea id="guidelines" {...register('guidelines')} className="w-full px-3 py-2 text-black border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black" />
              {errors.guidelines && <p className="mt-1 text-sm text-black">{errors.guidelines.message}</p>}
            </div>

            <div>
              <label htmlFor="evaluationCriteria" className="block mb-2 text-sm font-bold text-black">Evaluation Criteria</label>
              <textarea 
                id="evaluationCriteria"
                {...register('evaluationCriteria')} 
                className="w-full px-3 py-2 text-black border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black" 
              />
              {errors.evaluationCriteria && <p className="mt-1 text-sm text-black">{errors.evaluationCriteria.message}</p>}
            </div>

            <div>
              <label htmlFor="bounty" className="block mb-2 text-sm font-bold text-black">Bounty</label>
              <input 
                id="bounty"
                type="number" 
                step="0.01"
                {...register('bounty', { valueAsNumber: true })} 
                className="w-full px-3 py-2 text-black border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black" 
              />
              {errors.bounty && <p className="mt-1 text-sm text-black">{errors.bounty.message}</p>}
            </div>

            <div>
              <label htmlFor="breakdown" className="block mb-2 text-sm font-bold text-black">Bounty Breakdown</label>
              <textarea 
                id="breakdown"
                {...register('breakdown')} 
                className="w-full px-3 py-2 text-black border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black" 
              />
              {errors.breakdown && <p className="mt-1 text-sm text-black">{errors.breakdown.message}</p>}
            </div>

            <div>
              <label htmlFor="contact" className="block mb-2 text-sm font-bold text-black">Contact</label>
              <input id="contact" type="email" {...register('contact')} className="w-full px-3 py-2 text-black border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black" />
              {errors.contact && <p className="mt-1 text-sm text-black">{errors.contact.message}</p>}
            </div>

            <div>
              <label htmlFor="skills" className="block mb-2 text-sm font-bold text-black">Skills (comma-separated)</label>
              <input 
                id="skills"
                type="text" 
                {...register('skills')} 
                onChange={handleSkillsChange}
                className="w-full px-3 py-2 text-black border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black" 
              />
              {errors.skills && <p className="mt-1 text-sm text-black">{errors.skills.message}</p>}
            </div>

            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-black border-2 border-black rounded-none hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black">
              Create Gig
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GigForm