import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    image: z.string().optional(), // removed nullable
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.image !== undefined,
    { message: "At least one field must be provided" },
  );

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export const CreateTripSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  tourType: z.string().min(2, "Tour type must be at least 2 characters"),
  includes: z.string().min(5, "Includes must describe what's included"),
  notes: z.string().optional(),
  places: z.array(z.string()).min(1, "At least one place is required"),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export const updateTripSchema = z
  .object({
    title: z.string().min(3).optional(),
    tourType: z.string().min(2).optional(),
    includes: z.string().min(5).optional(),
    notes: z.string().optional(),
    places: z.array(z.string()).min(1).optional(),
    description: z.string().optional(),
    images: z.array(z.string()).min(1).optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.tourType !== undefined ||
      data.includes !== undefined ||
      data.notes !== undefined ||
      data.places !== undefined ||
      data.description !== undefined ||
      data.images !== undefined,
    { message: "At least one field must be provided to update" },
  );
