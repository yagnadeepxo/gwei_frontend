import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/login', data);
      const { user_token, userId } = response.data;
      localStorage.setItem('user_token', user_token);
      alert('Login successful');
      router.push('/'); // Redirect to home page or dashboard
    } catch (error) {
      alert('Login failed');
      console.error(error);
    }
  };

  return { register, handleSubmit, errors, onSubmit };
};
