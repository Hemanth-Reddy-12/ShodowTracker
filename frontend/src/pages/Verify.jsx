import React, { useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";

const Verify = () => {
  const { isAuthenticated, verify2FA, error } = useAuthStore();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (paste.length === 6) {
      setDigits(paste.split(""));
      inputRefs.current[5].focus();
    }
  };

  const handleInput = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    try {
      const log = await verify2FA(code);
      console.log(log.data.msg);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.log(error);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="p-10 max-w-md rounded-2xl absolute md:shadow-2xl mx-auto ">
        <h2 className="text-2xl font-bold mb-4 aladin text-center">
          Verify Your Code
        </h2>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {digits.map((digit, index) => (
            <motion.input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-full h-12 text-center text-xl border-2 rounded focus:border-4 focus:border-blue-500 "
              whileFocus={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </div>
        <motion.button
          type="submit"
          className=" button px-4 py-2 rounded flex items-center justify-center w-full aladin"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div onClick={handleVerify}>Verify Code</div>
        </motion.button>
      </div>
    </div>
  );
};

export default Verify;
