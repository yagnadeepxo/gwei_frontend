import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const loginBusinessSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginBusinessFormData = z.infer<typeof loginBusinessSchema>;

export const useLoginBusiness = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginBusinessFormData>({
    resolver: zodResolver(loginBusinessSchema),
  });

  const onSubmit = async (data: LoginBusinessFormData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/businesses/login', data);
      const { business_token, businessId } = response.data;
      localStorage.setItem('business_token', business_token);
      //localStorage.setItem('businessId', businessId);
      alert('Business login successful');
      router.push('/'); // Redirect to home page or dashboard
    } catch (error) {
      alert('Business login failed');
      console.error(error);
    }
  };

  return { register, handleSubmit, errors, onSubmit };
};
