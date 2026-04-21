import { useEffect, useRef, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import type { UserType } from "../../types/user.types";

type FormDataType = {
  fullName: string;
  userName: string;
  email: string;
  bio: string;
  link: string;
  newPassword: string;
  currentPassword: string;
};

const EditProfileModal = ({ authUser }: { authUser: UserType | undefined }) => {
  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    userName: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  // ✅ typed handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ sync auth user
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        userName: authUser.userName || "", // ✅ fixed key
        email: authUser.email || "",
        bio: authUser.bio || "",
        link: authUser.link || "",
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  // ✅ submit handler
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    await updateProfile({
      fullName: formData.fullName,
      userName: formData.userName,
      email: formData.email,
      bio: formData.bio,
      link: formData.link,
      newPassword: formData.newPassword,
      currentPassword: formData.currentPassword,
    });

    dialogRef.current?.close(); // ✅ close modal after success
  };

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() => dialogRef.current?.showModal()}
      >
        Edit profile
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2"
              />

              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2"
              />

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2"
              />

              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2"
              />
            </div>

            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Link"
              className="input border border-gray-700 rounded p-2"
            />

            <button className="btn btn-primary rounded-full text-white">
              {isUpdatingProfile ? "Updating..." : "Update"}
            </button>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
