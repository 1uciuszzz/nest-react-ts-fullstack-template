import { createBrowserRouter } from "react-router-dom";

const dynImport = async (path: string) => {
  const component = await import(path);
  return {
    Component: component.default,
  };
};

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => dynImport("./App.tsx"),
  },
]);
