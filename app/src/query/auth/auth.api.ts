import api from "@/services/axios";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  CurrentUser,
} from "./auth.types";

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data;
};


export const signup = async (payload: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>("/auth/create_user", payload);
  return response.data;
};


export const verifyOtp = async (
  payload: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const response = await api.post<VerifyOtpResponse>("/auth/verify_user", payload);
  return response.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<void> => {
  const response = await api.post<void>("/auth/forgot-password", payload);
  return response.data;
};

export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<void> => {
  const response = await api.post<void>("/auth/reset-password", payload);
  return response.data;
};

export const resendOtp = async (
  payload: ResendOtpRequest
): Promise<void> => {
  const response = await api.post<void>("/auth/resend-otp", payload);
  return response.data;
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get<CurrentUser>("/auth/me");
  return response.data;
};

