import api from "@/services/axios";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
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
