import { Link } from "react-router-dom";

import LoadingSpinner from "../skeletons/LoadingSpinner";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../services/axiosInstance";
import type { UserType } from "../../types/user.types";
import { useFollowHook } from "../../hooks/useFollowHook";

const RightPanel = () => {
  const { mutate: followUnfollow, isPending } = useFollowHook();

  const {
    data: suggestedQueryRes,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("profile/suggested-users");
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  console.log({ suggestedQueryRes, error, isPending, isError, isLoading });
  const suggestedUsers = suggestedQueryRes?.data;
  if (suggestedUsers?.length === 0)
    return <div className="md:w-64 w-0">No Suggested Users Found</div>;

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user: UserType) => (
              <Link
                to={`/profile/${user.userName}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={user.profileImage || "/avatar-placeholder.png"}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.userName}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      followUnfollow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
