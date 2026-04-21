import { useQuery } from "@tanstack/react-query";
import {
  axiosInstance,
  type ApiSuccessResponse,
} from "../services/axiosInstance";
import type { PostType } from "../types/post.types";

export const usePostHook = ({
  feedType,
  userName,
  userId,
  endPoint,
}: {
  feedType?: string;
  userName?: string;
  userId?: string;
  endPoint: string;
}) => {
  return useQuery({
    queryKey: ["posts", "list", feedType || userName || userId],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<ApiSuccessResponse<PostType[]>>(endPoint);
      console.log({ data });

      return data?.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 1,
  });
};
