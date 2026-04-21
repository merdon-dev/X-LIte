import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { useAuthHook } from "../../hooks/useAuthHook";
import { useUserProfileHook } from "../../hooks/useUserProfileHook";
import { useFollowHook } from "../../hooks/useFollowHook";
import Posts from "../post/Posts";
import EditProfileModal from "./EditProfile";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
  const { userName } = useParams();

  const [coverImage, setCoverImg] = useState<string | null>(null);
  const [profileImage, setProfileImg] = useState<string | null>(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef<HTMLInputElement>(null);
  const profileImgRef = useRef<HTMLInputElement>(null);

  const { data: authUser } = useAuthHook();

  const {
    data: user,
    isLoading,
    isRefetching,
  } = useUserProfileHook({ userName });

  const queryClient = useQueryClient();

  const postList = queryClient.getQueryData(["posts", "list", "posts"]);

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
  const { mutate: follow, isPending } = useFollowHook();

  if (!user && !isLoading && !isRefetching) {
    return <p className="text-center text-lg mt-4">User not found</p>;
  }

  const isMyProfile = authUser?._id === user?._id;
  const amIFollowing = authUser?.following?.includes(user?._id);

  const memberSinceDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "";

  // 📸 Image Preview Handler
  const handleImgChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "coverImage" | "profileImage",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === "coverImage") setCoverImg(reader.result as string);
      if (type === "profileImage") setProfileImg(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}

      {!isLoading && !isRefetching && user && (
        <>
          {/* TOP BAR */}
          <div className="flex gap-10 px-4 py-2 items-center">
            <Link to="/">
              <FaArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex flex-col">
              <p className="font-bold text-lg">{user.fullName}</p>
              <span className="text-sm text-slate-500">
                {postList ? Object.values(postList).length : 0} posts
              </span>
            </div>
          </div>

          {/* COVER */}
          <div className="relative group/cover">
            <img
              src={coverImage || user.coverImage || "/cover.png"}
              className="h-52 w-full object-cover"
            />

            {isMyProfile && (
              <div
                className="absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-75 rounded-full cursor-pointer opacity-0 group-hover/cover:opacity-100"
                onClick={() => coverImgRef.current?.click()}
              >
                <MdEdit className="w-5 h-5 text-white" />
              </div>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImage")}
            />

            <input
              type="file"
              hidden
              accept="image/*"
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, "profileImage")}
            />

            {/* AVATAR */}
            <div className="avatar absolute -bottom-16 left-4">
              <div className="w-32 rounded-full relative group/avatar">
                <img
                  src={
                    profileImage ||
                    user.profileImage ||
                    "/avatar-placeholder.png"
                  }
                />

                {isMyProfile && (
                  <div
                    className="absolute top-5 right-3 p-1 bg-primary rounded-full opacity-0 group-hover/avatar:opacity-100 cursor-pointer"
                    onClick={() => profileImgRef.current?.click()}
                  >
                    <MdEdit className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end px-4 mt-5">
            {isMyProfile ? (
              <EditProfileModal authUser={authUser} />
            ) : (
              <button
                className="btn btn-outline rounded-full btn-sm"
                onClick={() => follow(user._id)}
              >
                {isPending
                  ? "Loading..."
                  : amIFollowing
                    ? "Unfollow"
                    : "Follow"}
              </button>
            )}

            {(coverImage || profileImage) && (
              <button
                className="btn btn-primary rounded-full btn-sm ml-2 text-white"
                onClick={async () => {
                  await updateProfile({ coverImage, profileImage });
                  setCoverImg(null);
                  setProfileImg(null);
                }}
              >
                {isUpdatingProfile ? "Updating..." : "Update"}
              </button>
            )}
          </div>

          {/* USER INFO */}
          <div className="flex flex-col gap-4 mt-14 px-4">
            <div>
              <span className="font-bold text-lg">{user.fullName}</span>
              <p className="text-sm text-slate-500">@{user.userName}</p>
              <p className="text-sm my-1">{user.bio}</p>
            </div>

            <div className="flex gap-4 flex-wrap">
              {user.link && (
                <div className="flex items-center gap-1">
                  <FaLink className="w-3 h-3 text-slate-500" />
                  <a
                    href={user.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {user.link}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-1">
                <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-500">
                  {memberSinceDate}
                </span>
              </div>
            </div>

            {/* FOLLOW STATS */}
            <div className="flex gap-4">
              <div>
                <span className="font-bold text-xs">
                  {user.following.length}
                </span>{" "}
                <span className="text-xs text-slate-500">Following</span>
              </div>

              <div>
                <span className="font-bold text-xs">
                  {user.followers.length}
                </span>{" "}
                <span className="text-xs text-slate-500">Followers</span>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex border-b border-gray-700 mt-4">
            {["posts", "likes"].map((type) => (
              <div
                key={type}
                className="flex-1 text-center p-3 cursor-pointer hover:bg-secondary relative"
                onClick={() => setFeedType(type)}
              >
                {type}
                {feedType === type && (
                  <div className="absolute bottom-0 w-10 h-1 bg-primary rounded-full left-1/2 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* POSTS */}
      <Posts feedType={feedType} userName={userName} userId={user?._id} />
    </div>
  );
};

export default ProfilePage;
