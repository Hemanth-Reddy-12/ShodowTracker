import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { IoMdList } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import usePageStore from "../store/pageStore";

const Navbar = () => {
  const sidebarToggle = usePageStore((state) => state.sidebarToggle);
  const toggleSidebar = usePageStore((state) => state.toggleSidebar);
  return (
    <div className="w-full">
      <motion.div className="fixed text-2xl justify-between px-10 items-center flex w-full h-16 z-10 bg-[#F5F5F5]">
      <div className="logo"></div>
        <div className="md:block hidden ">
          <input type="text" className="search" placeholder="🔍 projects" />
        </div>
        <div className="dark-switch flex gap-3">
          <div>
            <MdDarkMode />
          </div>
          <div className="md:hidden block">
            <IoMdList
              className={
                sidebarToggle
                  ? "rotate-90 duration-500 ease-in-out transition-all"
                  : "duration-500 ease-in-out transition-all"
              }
              onClick={() => {
                toggleSidebar(!sidebarToggle);
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
