import { z } from 'zod';

export const userFormSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    location: z.string().min(2, 'Please enter your location'),
});

export const adminLoginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const coordinatesSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

export type UserFormData = z.infer<typeof userFormSchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;
export type CoordinatesData = z.infer<typeof coordinatesSchema>;
