import React from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import Socialicon from "../components/Socialicon";
import { useNavigate } from "react-router-dom";

const dropbutton = {
  hidden: {
    opacity: 0,
    y: "100vh",
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 100,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const Home = () => {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      <div className="aladin container h-screen w-full">
        <div className="flex justify-center items-center h-full ">
          <div className="place-items-center">
            <div className="">
              <div className="">
                <div className="text-xl md:text-3xl">
                  <motion.span
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 1,
                        duration: 0.4,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    Hey! {"  "}
                    <span className="font-[600] text-3xl md:text-5xl">
                      {" "}
                      Hemanth Reddy
                    </span>
                  </motion.span>
                </div>
              </div>
            </div>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 1,
                  duration: 0.4,
                  ease: "easeInOut",
                },
              }}
              className="pt-[100px]"
            >
              <Socialicon />
            </motion.div>
            <motion.div
              variants={dropbutton}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-[50px]"
              onClick={() => navigate("/airdrop")}
            >
              <button className="button">explore</button>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default Home;
