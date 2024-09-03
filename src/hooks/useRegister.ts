
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const useRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/users/register', data);
      alert('Registration successful');
      console.log(response.data);
    } catch (error) {
      alert('Registration failed');
      console.error(error);
    }
  };

  return { register, handleSubmit, errors, onSubmit };
};
