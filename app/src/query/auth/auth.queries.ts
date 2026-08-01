import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCurrentUser } from "./auth.api";
import type { CurrentUser } from "./auth.types";
import type { ApiErrorResponse } from "@/types/api";
import { isAuthenticated } from "@/utils/storage";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export const useCurrentUserQuery = (): UseQueryResult<
  CurrentUser,
  AxiosError<ApiErrorResponse>
> => {
  return useQuery<CurrentUser, AxiosError<ApiErrorResponse>>({
    queryKey: authKeys.me,
    queryFn: getCurrentUser,
    // /auth/me is JWT-secured; only fetch when logged in so guest pages
    // (Navbar dropdown) don't fire a 401 and bounce to login.
    enabled: isAuthenticated(),
  });
};
