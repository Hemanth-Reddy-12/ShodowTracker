import React from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden px-4 text-center">
      {/* Design gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 space-y-6"
      >
        <h1 className="text-9xl font-extrabold tracking-widest text-primary font-display drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground font-display">
            Page Not Found
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved to a new address.
          </p>
        </div>

        <Button 
          onClick={() => navigate("/")} 
          className="gap-2 cursor-pointer transition-all duration-200 mt-4"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
