// Authentication Query Types

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
 email: string,
  password: string,
  first_name: string,
  last_name: string,
  phone: string
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
