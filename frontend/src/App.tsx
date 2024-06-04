import { Outlet } from "react-router-dom";
import BottomBar from "./components/BottomBar";

const App = () => {
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
