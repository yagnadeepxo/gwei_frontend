'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

interface Gig {
  title: string;
  company: string;
  description: string;
  deadline: string;
  contact: string;
  bounty: string;
  breakdown: string;
  guidelines: string;
  evaluationCriteria: string;
  skills: string[];
}

interface ChatMessage {
  _id: string;
  gigId: string;
  username: string;
  message: string;
  createdAt: Date;
}

const FloatingCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="w-full max-w-md bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 font-mono flex flex-col h-[600px]">
    <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">{title}</h2>
    {children}
  </div>
);

const GigCard = ({ gig }: { gig: Gig }) => (
  <FloatingCard title="Gig Details">
    <div className="space-y-4 overflow-y-auto pr-2">
      <div>
        <h3 className="font-bold">Title:</h3>
        <p>{gig.title}</p>
      </div>
      <div>
        <h3 className="font-bold">Company:</h3>
        <p>{gig.company}</p>
      </div>
      <div>
        <h3 className="font-bold">Description:</h3>
        <p>{gig.description}</p>
      </div>
      <div>
        <h3 className="font-bold">Deadline:</h3>
        <p>{new Date(gig.deadline).toLocaleDateString()}</p>
      </div>
      <div>
        <h3 className="font-bold">Contact:</h3>
        <p>{gig.contact}</p>
      </div>
      <div>
        <h3 className="font-bold">Bounty Total:</h3>
        <p>${gig.bounty}</p>
      </div>
      <div>
        <h3 className="font-bold">Bounty Breakdown:</h3>
        <p>{gig.breakdown}</p>
      </div>
      <div>
        <h3 className="font-bold">Guidelines:</h3>
        <p>{gig.guidelines}</p>
      </div>
      <div>
        <h3 className="font-bold">Evaluation Criteria:</h3>
        <p>{gig.evaluationCriteria}</p>
      </div>
      <div>
        <h3 className="font-bold">Skills Required:</h3>
        <ul className="list-disc list-inside">
          {gig.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  </FloatingCard>
);

const ChatCard = ({ gigId }: { gigId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, [gigId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/${gigId}/chats`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const token = localStorage.getItem('user_token');
        if (!token) {
          alert('Please log in to send messages.');
          return;
        }
        const response = await axios.post(
          `http://localhost:3001/api/${gigId}/chat`,
          { message: newMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const newChat = {
          ...response.data,
          createdAt: new Date().toISOString()  
        };
      
        setMessages(prevMessages => [...prevMessages, newChat]);
        setNewMessage('');
        fetchChats();
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      }
    }
  };

  return (
    <FloatingCard title="Chat Messages">
      <div 
        ref={scrollRef}
        className="flex-grow space-y-4 overflow-y-auto pr-2 mb-4"
      >
        {messages.map((chat) => (
          <div key={chat._id} className="border-b border-gray-200 pb-2">
            <div className="flex justify-between items-baseline">
              <span className="font-bold">{chat.username}</span>
              <span className="text-xs text-gray-500">
                {new Date(chat.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-sm">{chat.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow px-3 py-2 border-2 border-black focus:outline-none mr-2"
          aria-label="Type a message"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white hover:bg-gray-800 focus:outline-none"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </FloatingCard>
  );
};

const GigDetails = () => {
  const params = useParams();
  const router = useRouter();
  const gigId = params.gigId as string;
  const [gig, setGig] = useState<Gig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');

  useEffect(() => {
    if (gigId) {
      axios.get(`http://localhost:3001/api/getGigById/${gigId}`)
        .then(response => setGig(response.data))
        .catch(error => console.error('Error fetching gig:', error));
    }
  }, [gigId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('user_token');
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
        //localStorage.removeItem('token');
        router.push('/login');
      } else {
        alert('Error submitting. Please try again.');
      }
    }
  };

  const handleSubmitClick = () => {
    const token = localStorage.getItem('user_token');
    if (token) {
      setShowModal(true);
    } else {
      router.push('/login');
    }
  };

  if (!gig) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100 p-4">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <GigCard gig={gig} />
        <ChatCard gigId={gigId} />
      </div>
      <button
        onClick={handleSubmitClick}
        className="fixed bottom-4 right-4 bg-black text-white font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black transition-colors duration-200"
      >
        Submit Work
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
                placeholder="Enter Submission Link"
                required
                className="w-full px-3 py-2 border-2 border-black focus:outline-none mb-4"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-black text-white font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black transition-colors duration-200"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white text-black font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors duration-200"
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
