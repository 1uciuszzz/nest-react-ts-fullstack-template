import { Outlet } from "react-router-dom";
import BottomBar from "./components/BottomBar";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { CircularProgress } from "@mui/material";
import { API_AUTH } from "./apis/auth";
import { accountAtom } from "./stores/account";
import { profileAtom } from "./stores/profile";

const App = () => {
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

  return (
    <>
      <div>
        <Outlet />
      </div>

      <div className="h-16"></div>

      <div className="w-full fixed bottom-0 left-0 z-50">
        <BottomBar />
      </div>
    </>
  );
};

export default App;
