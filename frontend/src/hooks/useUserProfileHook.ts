import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/axiosInstance";
import type { UserType } from "../types/user.types";

export const useUserProfileHook = ({ userName }: { userName?: string }) => {
  return useQuery<UserType>({
    queryKey: ["userProfile", userName],
    enabled: !!userName,
    queryFn: async () => {
      const { data } = await axiosInstance.get(`profile/${userName}`);
      return data.data;
    },
  });
};
