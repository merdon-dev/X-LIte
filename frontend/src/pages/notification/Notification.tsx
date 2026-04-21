import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

import { axiosInstance } from "../../services/axiosInstance";
import LoadingSpinner from "../../components/skeletons/LoadingSpinner";

type NotificationType = {
  _id: string;
  type: "follow" | "like";
  from: {
    _id: string;
    userName: string;
    profileImage?: string;
  };
};

const NotificationPage = () => {
  const queryClient = useQueryClient();

  // ✅ GET notifications
  const { data: notifications, isLoading } = useQuery<NotificationType[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/notification");
      return data.data;
    },
  });

  // ✅ DELETE notifications
  const { mutate: deleteNotifications, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete("/notification");
      return data;
    },

    onSuccess: () => {
      toast.success("Notifications deleted successfully");

      // ✅ instant UI update (no refetch)
      queryClient.setQueryData<NotificationType[]>(["notifications"], () => []);
    },

    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold">Notifications</p>

        <div className="dropdown">
          <div tabIndex={0} role="button" className="m-1">
            <IoSettingsOutline className="w-4" />
          </div>

          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <button onClick={() => deleteNotifications()}>
                {isPending ? "Deleting..." : "Delete all notifications"}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && notifications?.length === 0 && (
        <div className="text-center p-4 font-bold">No notifications 🤔</div>
      )}

      {/* LIST */}
      {notifications?.map((notification) => (
        <div className="border-b border-gray-700" key={notification._id}>
          <div className="flex gap-2 p-4 items-center">
            {notification.type === "follow" && (
              <FaUser className="w-7 h-7 text-primary" />
            )}
            {notification.type === "like" && (
              <FaHeart className="w-7 h-7 text-red-500" />
            )}

            <Link
              to={`/profile/${notification.from.userName}`}
              className="flex gap-2 items-center"
            >
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={
                      notification.from.profileImage ||
                      "/avatar-placeholder.png"
                    }
                  />
                </div>
              </div>

              <div className="flex gap-1 text-sm">
                <span className="font-bold">@{notification.from.userName}</span>

                <span>
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </span>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;
