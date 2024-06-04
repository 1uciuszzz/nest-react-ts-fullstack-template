import { createBrowserRouter } from "react-router-dom";



export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({Component: (await import("./App.tsx")).default}),
  },
]);
