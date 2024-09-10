'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Gig {
  _id: string
  title: string
  description: string
  bounty: number
  company: string
  deadline: string
  guidelines: string
  evaluationCriteria: string
  breakdown: string
  contact: string
  skills: string[]
}

const Dashboard = () => {
  const params = useParams()
  const router = useRouter()
  const companyName = params.companyName as string
  const [companyNameState, setCompanyNameState] = useState<string | null>(null)
  const [gigs, setGigs] = useState<Gig[]>([])

  useEffect(() => {
    if (companyName) {
      axios.get(`http://localhost:3001/api/businesses/${companyName}`)
        .then(response => setCompanyNameState(response.data.name))
        .catch(error => console.error('Error fetching company name:', error))

      axios.get(`http://localhost:3001/api/gigs/${companyName}`)
        .then(response => setGigs(response.data))
        .catch(error => console.error('Error fetching gigs:', error))
    }
  }, [companyName])

  const handleGigClick = (gigId: string) => {
    if (gigId) {
      router.push(`/${companyName}/gig/${gigId}`)
    } else {
      console.error('Gig ID is undefined')
    }
  }

  if (!companyNameState) {
    return <div className="font-mono text-center p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white-100 font-mono">
      <nav className="bg-white border-b-2 border-black mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href={`/${companyName}/createGig`}>
            <button className="px-4 py-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all duration-100">
              Create Gig
            </button>
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig: Gig) => (
            <div 
              key={gig._id} 
              className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-100"
              onClick={() => router.push(`/${companyName}/gig/${gig._id}`)}
            >
              <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">{gig.title}</h2>
              <p className="mb-4">{gig.description}</p>
              <p className="text-lg font-bold">Pay: ${gig.bounty}</p>
              <p className="mt-2">Deadline: {new Date(gig.deadline).toLocaleDateString()}</p>
              <p className="mt-2">Skills: {gig.skills.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard