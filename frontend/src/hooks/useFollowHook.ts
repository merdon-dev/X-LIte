import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/axiosInstance";
import toast from "react-hot-toast";

export const useFollowHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["followUnfollow"],
    mutationFn: async (userId: string) => {
      const { data } = await axiosInstance.post(
        `profile/follow-unfollow/${userId}`,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({
        queryKey: ["suggestedUsers"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
