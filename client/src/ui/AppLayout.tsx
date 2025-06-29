import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function AppLayout() {
  return (
    <div className="flex h-screen flex-col">
      <main className="h-[97%]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
