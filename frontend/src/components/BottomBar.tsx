import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { AccountCircle, Home } from "@mui/icons-material";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";

const BottomBar = () => {
  const [value, setValue] = useImmer(0);

  return (
    <>
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Me"
          icon={<AccountCircle />}
          component={Link}
          to="/"
        />
      </BottomNavigation>
    </>
  );
};

export default BottomBar;
