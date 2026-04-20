// import Providers from "./app/providers";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    // <Providers>
    <div data-theme="black">
      <Toaster />
      <RouterProvider router={router} />
    </div>
    // </Providers>
  );
}
