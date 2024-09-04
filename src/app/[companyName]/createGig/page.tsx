'use client'

import React from 'react';
import GigForm from '@/components/Gig';
import { useGigs } from '@/hooks/useGigs';

const CreateGigPage = () => {
  const { gigs } = useGigs();

  return (
    <div className="create-gig-page">
      <GigForm />
    </div>
  );
};

export default CreateGigPage;
