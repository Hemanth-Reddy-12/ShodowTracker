import React from "react";
import { FaEthereum } from "react-icons/fa6";
import { SiCashapp } from "react-icons/si";
import { TiHome } from "react-icons/ti";
import usePageStore from "../store/pageStore";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Sidebar = () => {
  const currentPage = usePageStore((state) => state.currentPage);
  const sidebarToggle = usePageStore((state) => state.sidebarToggle);
  const navigate = useNavigate();

  return (
    <div className="block">
      <div className="side md:fixed hidden w-[80px] md:flex flex-col h-screen items-center gap-10 justify-center ">
        <div className="button rounded-xl p-2">
          <TiHome size={30} onClick={() => navigate("/")} />
        </div>
        <div
          className={
            currentPage.startsWith("/airdrop")
              ? "button active rounded-xl p-2"
              : "button p-2"
          }
        >
          <FaEthereum size={30} onClick={() => navigate("/airdrop")} />
        </div>
        <div
          className={
            currentPage === "/rewards"
              ? "button active rounded-xl p-2"
              : "button p-2"
          }
        >
          <SiCashapp size={30} onClick={() => navigate("/rewards")} />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1, ease: "easeInOut" } }}
        className={sidebarToggle ? "block" : "hidden"}
      >
        <div className="h-1/2 border-t-2 rounded-t-4xl bg-white fixed bottom-0 md:hidden w-full">
          <div className="text-center w-full p-10 my-10">
            <p className="font-bold text-2xl">Shadow Tracker</p>
            <div className=" button my-10" onClick={() => navigate("/")}>
              Home
            </div>
            <div className=" button my-10" onClick={() => navigate("/airdrop")}>
              airdrop
            </div>
            <div className=" button my-10" onClick={() => navigate("/rewards")}>
              rewards
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
