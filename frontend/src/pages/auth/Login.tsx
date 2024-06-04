import { useImmer } from "use-immer";
import { API_AUTH, LoginReq } from "../../apis/auth";
import VStack from "../../components/VStack";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const initalData: LoginReq = {
  username: "",
  password: "",
};

const Login = () => {
  const [data, setData] = useImmer<LoginReq>(initalData);

  const navigate = useNavigate();

  const { isPending, mutate, isError, error } = useMutation({
    mutationFn: () => API_AUTH.LOGIN(data),
    onSuccess: (res) => {
      localStorage.setItem("bbsexamination_token", res.data.token);
      navigate("/");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.username && data.password) {
      mutate();
    } else {
      toast.error("please enter username and password");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4">
        <VStack>
          <Typography variant="h5">Turbo guacamole</Typography>

          <Typography variant="h6">Login page</Typography>

          <TextField
            label="Username"
            type="text"
            value={data.username}
            onChange={(e) =>
              setData((d) => {
                d.username = e.target.value;
              })
            }
          />

          <TextField
            label="Password"
            type="password"
            value={data.password}
            onChange={(e) =>
              setData((d) => {
                d.password = e.target.value;
              })
            }
          />

          {isError && <Alert severity="error">{error.message}</Alert>}

          <Button
            variant="outlined"
            size="large"
            type="submit"
            disabled={isPending}
          >
            Login
          </Button>

          <Typography variant="body1">
            Don't have an account?
            <Link to="/auth/register" className="underline text-blue-600">
              Register
            </Link>
          </Typography>
        </VStack>
      </form>
    </>
  );
};

export default Login;
