import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/axiosInstance";

export type UpdateProfilePayload = {
  fullName?: string;
  userName?: string;
  email?: string;
  bio?: string;
  link?: string;

  coverImage?: string | null;
  profileImage?: string | null;

  currentPassword?: string;
  newPassword?: string;
};

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (formData: UpdateProfilePayload) => {
        const { data } = await axiosInstance.post(
          "/profile/update-user",
          formData,
        );

        return data;
      },

      onSuccess: async () => {
        toast.success("Profile updated successfully");

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["authUser"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["userProfile"],
          }),
        ]);
      },

      onError: (error: unknown) => {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      },
    });

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
