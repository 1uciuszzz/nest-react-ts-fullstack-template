import { Navigate, Outlet } from "react-router-dom";
import { API_AUTH } from "../../apis/auth";
import { useMutation } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";

const AuthPage = () => {
  const { isPending, mutate, isSuccess } = useMutation({
    mutationFn: () => API_AUTH.ME(),
    retry: 0,
  });

  const token = localStorage.getItem("bbsexamination_token");

  if (token) {
    mutate();
  }

  if (isPending) return <CircularProgress />;

  if (isSuccess) return <Navigate to="/" />;

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthPage;
