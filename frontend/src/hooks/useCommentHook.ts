import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../services/axiosInstance";

export const useCommentHook = () => {
  return useMutation({
    mutationKey: ["comment"],
    mutationFn: async ({
      userComment,
      postId,
    }: {
      userComment: string;
      postId: string;
    }) => {
      const { data } = await axiosInstance.post(`post/comment/${postId}`, {
        userComment: userComment.trim(),
      });
      return data;
    },
  });
};
