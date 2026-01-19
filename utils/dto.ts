export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateAdminDTO {
  email: string;
  name: string;
  password: string;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  image?: string; // not nullable
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateTripDTO {
  title: string;
  tourType: string;
  includes: string;
  notes?: string;
  places: string[];
  description?: string;
  images: string[];
}

export interface UpdateTripDTO {
  title?: string;
  tourType?: string;
  includes?: string;
  notes?: string;
  places?: string[];
  description?: string;
  images?: string[];
}
