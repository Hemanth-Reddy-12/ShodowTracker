import React from "react";
import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaMedium,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";
import { SiFarcaster } from "react-icons/si";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";

const Socialicon = () => {
  const Socialdata = [
    {
      name: "Discord",
      icon: FaDiscord,
      url: "https://discord.com/",
    },
    {
      name: "Linkedin",
      icon: FaLinkedin,
      url: "https://www.linkedin.com/in/hemanthreddy/",
    },
    {
      name: "Github",
      icon: FaGithub,
      url: "https://github.com/hemanthreddy",
    },
    {
      name: "Medium",
      icon: FaMedium,
      url: "https://medium.com/@hemanthreddy",
    },
    {
      name: "Farcaster",
      icon: SiFarcaster,
      url: "https://farcaster.xyz/u/hemanthreddy",
    },
    {
      name: "XTwitter",
      icon: FaXTwitter,
      url: "https://xtwitter.com/hemanthreddy",
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      url: "https://t.me/hemanthreddy",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[70px]">
      {Socialdata.map((item, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <motion.a
            href=""
            initial={{ x: 100 }}
            animate={{
              x: 0,
              transition: {
                duration: 2,
                ease: "easeInOut",
              },
            }}
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.9,
            }}
          >
            <item.icon className="socialicon " />
          </motion.a>
        </motion.div>
      ))}
    </div>
  );
};

export default Socialicon;
