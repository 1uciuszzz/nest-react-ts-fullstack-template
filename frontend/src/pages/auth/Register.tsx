import { useImmer } from "use-immer";
import { API_AUTH, RegisterReq } from "../../apis/auth";
import { useMutation } from "@tanstack/react-query";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import VStack from "../../components/VStack";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const initalData: RegisterReq = {
  username: "",
  password: "",
};

const Register = () => {
  const [data, setData] = useImmer<RegisterReq>(initalData);

  const [checkPassword, setCheckPassword] = useImmer<string>("");

  const navigate = useNavigate();

  const { isPending, mutate, isError, error } = useMutation({
    mutationFn: () => API_AUTH.REGISTER(data),
    onSuccess: (res) => {
      localStorage.setItem("bbsexamination_token", res.data.token);
      navigate("/");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      data.username &&
      data.password &&
      checkPassword &&
      data.password == checkPassword
    ) {
      mutate();
    } else {
      toast.error("Please enter username and password, and check password");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4">
        <VStack>
          <Typography variant="h5">Turbo guacamole</Typography>

          <Typography variant="h6">Register page</Typography>

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

          <TextField
            label="Check Password"
            type="password"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
          />

          {isError && <Alert severity="error">{error.message}</Alert>}

          <Button
            variant="outlined"
            size="large"
            type="submit"
            disabled={isPending}
          >
            Register
          </Button>

          <Typography>
            Already have an account?
            <Link to="/auth" className="underline text-blue-600">
              Login
            </Link>
          </Typography>
        </VStack>
      </form>
    </>
  );
};

export default Register;
