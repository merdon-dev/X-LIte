import { useState } from "react";
import { Link } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import XSvg from "../../../components/svgs/Xsvg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  axiosInstance,
  type ApiErrorResponse,
} from "../../../services/axiosInstance";
import type { AxiosError } from "axios";
import type { FormPayload } from "../../../types/auth.signin.types";

const LoginPage = () => {
  const [formData, setFormData] = useState<FormPayload>({
    userName: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ formData }: { formData: FormPayload }) => {
      const res = await axiosInstance.post("/auth/sign-in", formData);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error?.message || "Something went wrong";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({ formData });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="userName"
              name="userName"
              onChange={handleInputChange}
              value={formData.userName}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Login"}
          </button>
          {isError && (
            <p className="text-red-500">{error?.message || "Error"}</p>
          )}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/sign-up">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
