import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { login, signup, verifyOtp } from "./auth.api";
import { saveToken } from "@/utils/storage";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "./auth.types";


export const useLoginMutation = (options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
}): UseMutationResult<LoginResponse, Error, LoginRequest> => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.access_token) {
        saveToken(data.access_token);
      }
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};


export const useSignupMutation = (options?: {
  onSuccess?: (data: SignupResponse) => void;
  onError?: (error: Error) => void;
}): UseMutationResult<SignupResponse, Error, SignupRequest> => {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signup,
    onSuccess: (data) => {
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};



export const useVerifyOtpMutation = (options?: {
  onSuccess?: (data: VerifyOtpResponse) => void;
  onError?: (error: Error) => void;
}): UseMutationResult<VerifyOtpResponse, Error, VerifyOtpRequest> => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpRequest>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data.access_token) {
        saveToken(data.access_token);
      }
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
