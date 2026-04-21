import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/axiosInstance";
import type { CommentType, PostType } from "../types/post.types";

export const useCommentHook = ({ feedType }: { feedType?: string }) => {
  const queryClient = useQueryClient();
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

      return { postId, comment: data.data };
    },
    onSuccess: ({
      postId,
      comment,
    }: {
      postId: string;
      comment: CommentType;
    }) => {
      queryClient.setQueryData(
        ["posts", "list", feedType],
        (existingPosts: PostType[]) => {
          if (!existingPosts) return existingPosts;

          return existingPosts.map((p: PostType) =>
            p._id === postId ? { ...p, comments: [...p.comments, comment] } : p,
          );
        },
      );
    },
  });
};
