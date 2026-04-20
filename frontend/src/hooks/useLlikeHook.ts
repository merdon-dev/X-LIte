import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  axiosInstance,
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "../services/axiosInstance";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { PostType } from "../types/post.types";

export const useLikeHook = ({ feedType }: { feedType?: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["like"],

    mutationFn: async (postId: string) => {
      const res = await axiosInstance.post<ApiSuccessResponse<any>>(
        `post/like/${postId}`,
      );
      return { postId, likes: res.data.data?.likes };
    },

    onSuccess: ({ postId, likes }) => {
      queryClient.setQueryData(
        ["posts", "list", feedType],
        (oldData: PostType[]) => {
          console.log({ oldData, likes });

          if (!oldData) return oldData;

          return oldData.map((p: PostType) =>
            p._id === postId ? { ...p, likes } : p,
          );
        },
      );
    },

    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err?.message || "Like failed");
    },
  });
};
