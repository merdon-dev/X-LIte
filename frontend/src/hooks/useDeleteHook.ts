import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/axiosInstance";
import toast from "react-hot-toast";
import type { PostType } from "../types/post.types";

export const useDeleteHook = ({ feedType }: { feedType?: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deletePost"],
    mutationFn: async ({ postId }: { postId: string }) => {
      await axiosInstance.delete(`post/delete/${postId}`);
      return postId;
    },
    onSuccess: (postId) => {
      toast.success("Post Deleted Successfully");

      queryClient.setQueryData(
        ["post", "list", feedType],
        (allPost: PostType[] | undefined) => {
          if (!allPost) return allPost;

          return allPost.filter((post) => post._id !== postId);
        },
      );
    },
  });
};
