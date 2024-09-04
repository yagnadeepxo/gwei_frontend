import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const registerBusinessSchema = z.object({
  name: z.string().min(3, 'Business name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type RegisterBusinessFormData = z.infer<typeof registerBusinessSchema>;

export const useRegisterBusiness = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterBusinessFormData>({
    resolver: zodResolver(registerBusinessSchema),
  });

  const onSubmit = async (data: RegisterBusinessFormData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/businesses/register', data);
      alert('Business registration successful');
      console.log(response.data);
    } catch (error) {
      alert('Business registration failed');
      console.error(error);
    }
  };

  return { register, handleSubmit, errors, onSubmit };
};
