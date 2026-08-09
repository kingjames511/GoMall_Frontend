export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  referral_code?: string;
}

export interface SignupResponse {
  action: string;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface ResendOtpRequest {
  email: string;
}

// GET /auth/me — the currently authenticated user's profile.
export interface CurrentUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  is_verified: boolean;
}

