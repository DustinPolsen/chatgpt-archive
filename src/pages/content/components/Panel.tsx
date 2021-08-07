import { useAtom } from "jotai";
import { panelOpenAtom } from "../context";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { Spinner } from "@src/components/Spinner";
import { useRefresh } from "../hook";
import Footer from "./Footer";
import CustomDialog from "@src/components/CustomDialog";
import { memo } from "react";

const PanelConent = memo(function PanelContent() {
  const { refreshing } = useRefresh();
  console.log("render Panel", { refreshing });
  return (
    <>
      <Header />
      <ProgressBar />
      <div className="relative flex flex-col flex-1 min-h-0">
        {!refreshing ? <Outlet /> : <Spinner />}
      </div>
      {/* <BottomNavBar /> */}
      <Footer />
    </>
  );
});

export default function Panel() {
  const [open] = useAtom(panelOpenAtom);
  return (
    <CustomDialog
      className={"page-px flex-col bg-background z-40"}
      open={open}
      duration={200}
      style={{
        position: "fixed",
        top: 0,
        height: "100vh",
        width: "400px",
      }}
      id="panel"
    >
      <PanelConent />
    </CustomDialog>
  );
}
