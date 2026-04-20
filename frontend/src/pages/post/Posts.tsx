import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import {
  axiosInstance,
  type ApiSuccessResponse,
} from "../../services/axiosInstance";
import Post from "./Post";
import type { PostType } from "../../types/post.types";

const Posts = ({
  feedType,
  userName,
  userId,
}: {
  feedType?: string;
  userName?: string;
  userId?: string;
}) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "post/get-allPosts";
      case "following":
        return "post/following-posts";
      case "posts":
        return `post/user/${userName}`;
      case "likes":
        return `post/likes/${userId}`;
      default:
        return "post/get-allPosts";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["posts", "list", feedType || userName || userId],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<ApiSuccessResponse<any>>(POST_ENDPOINT);
      console.log({ data });

      return data?.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 1,
  });

  console.log({ posts });

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post: PostType) => (
            <Post key={post._id} post={post} feedType={feedType} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
