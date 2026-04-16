// import Providers from "./app/providers";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";

export default function App() {
  return (
    // <Providers>
    <div data-theme="black">
      <RouterProvider router={router} />
    </div>
    // </Providers>
  );
}
