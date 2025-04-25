// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Loading = () => {
  const LoadingVariants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className="container flex h-screen items-center justify-center gap-2 underline "
    >
      <motion.div
        variants={LoadingVariants}
        className="h-4 w-4 rounded-full bg-green-600"
      />
      <motion.div
        variants={LoadingVariants}
        className="h-4 w-4 rounded-full bg-red-600"
      />
      <motion.div
        variants={LoadingVariants}
        className="h-4 w-4 rounded-full bg-yellow-600"
      />
    </motion.div>
  );
};

export default Loading;
