import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  axiosInstance,
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "../services/axiosInstance";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useLikeHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["like"],

    mutationFn: async (postId: string) => {
      const res = await axiosInstance.post<ApiSuccessResponse<string[]>>(
        `post/like/${postId}`,
      );
      return { postId, likes: res.data.data };
    },

    onSuccess: ({ postId, likes }) => {
      queryClient.setQueryData<any[]>(["posts"], (oldData) => {
        console.log({ oldData });

        if (!oldData) return oldData;

        return oldData.map((p) => (p._id === postId ? { ...p, likes } : p));
      });
    },

    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err.response?.data?.message || "Like failed");
    },
  });
};
