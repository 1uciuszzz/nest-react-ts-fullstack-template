import { useQuery } from "@tanstack/react-query";
import { API_AUTH } from "../../apis/auth";
import { useSetAtom } from "jotai";
import { CircularProgress } from "@mui/material";
import { accountAtom } from "../../stores/account";
import { profileAtom } from "../../stores/profile";

const HomePage = () => {
  const setAccount = useSetAtom(accountAtom);

  const setProfile = useSetAtom(profileAtom);

  const { isPending, data, isSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: () => API_AUTH.ME(),
    retry: 0,
  });

  if (isPending) return <CircularProgress />;

  if (isSuccess) {
    setAccount(data.data.account);
    setProfile(data.data.profile);
  }

  return <>HomePage</>;
};

export default HomePage;
