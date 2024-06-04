import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import(`./App.tsx`)).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import(`./pages/home/Page.tsx`)).default,
        }),
      },
    ],
  },
  {
    path: "/auth",
    lazy: async () => ({
      Component: (await import(`./pages/auth/Page.tsx`)).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import(`./pages/auth/Login.tsx`)).default,
        }),
      },
      {
        path: "register",
        lazy: async () => ({
          Component: (await import(`./pages/auth/Register.tsx`)).default,
        }),
      },
    ],
  },
]);
