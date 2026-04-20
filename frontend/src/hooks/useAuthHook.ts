import { useQuery } from "@tanstack/react-query";
import {
  axiosInstance,
  type ApiSuccessResponse,
} from "../services/axiosInstance";
import type { UserType } from "../types/user.types";

export const useAuthHook = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res =
        await axiosInstance.get<ApiSuccessResponse<UserType>>("auth/get-user");
      return res.data.data;
    },
    retry: false,

    staleTime: 1000 * 60 * 5, // ✅ 5 min no refetch
    // gcTime: 1000 * 60 * 10, // ✅ keep cache longer (v5)

    // refetchOnWindowFocus: false, // 🚫 stop refetch on tab focus
    // refetchOnMount: false, // 🚫 stop refetch on remount
    // refetchOnReconnect: false, // 🚫 stop refetch on internet reconnect
  });
};
