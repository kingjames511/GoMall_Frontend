import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { login, signup, verifyOtp, forgotPassword, resetPassword, resendOtp } from "./auth.api";
import { saveToken, saveRefreshToken } from "@/utils/storage";
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
} from "./auth.types";
import type { ApiErrorResponse } from "@/types/api";

export const useLoginMutation = (options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}): UseMutationResult<LoginResponse, AxiosError<ApiErrorResponse>, LoginRequest> => {
  return useMutation<LoginResponse, AxiosError<ApiErrorResponse>, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.access_token) {
        saveToken(data.access_token);
      }
      if (data.refresh_token) {
        saveRefreshToken(data.refresh_token);
      }
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useSignupMutation = (options?: {
  onSuccess?: (data: SignupResponse, variables: SignupRequest) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}): UseMutationResult<SignupResponse, AxiosError<ApiErrorResponse>, SignupRequest> => {
  return useMutation<SignupResponse, AxiosError<ApiErrorResponse>, SignupRequest>({
    mutationFn: signup,
    onSuccess: (data, variables) => {
      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useVerifyOtpMutation = (options?: {
  onSuccess?: (data: VerifyOtpResponse) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}): UseMutationResult<VerifyOtpResponse, AxiosError<ApiErrorResponse>, VerifyOtpRequest> => {
  return useMutation<VerifyOtpResponse, AxiosError<ApiErrorResponse>, VerifyOtpRequest>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data.access_token) {
        saveToken(data.access_token);
      }
      if (data.refresh_token) {
        saveRefreshToken(data.refresh_token);
      }
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useForgotPasswordMutation = (options?: {
  onSuccess?: (data: void) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}): UseMutationResult<void, AxiosError<ApiErrorResponse>, ForgotPasswordRequest> => {
  return useMutation<void, AxiosError<ApiErrorResponse>, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useResetPasswordMutation = (options?: {
  onSuccess?: (data: void) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}): UseMutationResult<void, AxiosError<ApiErrorResponse>, ResetPasswordRequest> => {
  return useMutation<void, AxiosError<ApiErrorResponse>, ResetPasswordRequest>({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useResendOtpMutation = (options?: {
  onSuccess?: (data: void) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}): UseMutationResult<void, AxiosError<ApiErrorResponse>, ResendOtpRequest> => {
  return useMutation<void, AxiosError<ApiErrorResponse>, ResendOtpRequest>({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};