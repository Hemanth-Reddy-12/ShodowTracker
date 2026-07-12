import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Auth = () => {
    const { isAuthenticated, login, signup, error, isLoading } = useAuthStore();
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError("");

        if (!username.trim() || !password.trim()) {
            setValidationError("All fields are required");
            return;
        }

        try {
            if (isSignUp) {
                await signup({ username, password });
            } else {
                await login({ username, password });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden px-4">
            {/* Design Gradients from ui-ux-pro-max */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md z-10"
            >
                <Card className="bg-secondary/40 border-border/80 backdrop-blur-xl shadow-2xl p-2">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-3xl font-bold tracking-tight text-foreground font-display">
                            {isSignUp ? "Create Account" : "Welcome Back"}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-1">
                            {isSignUp ? "Sign up for a new ShadowTracker account" : "Sign in to access your dashboard"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {(error || validationError) && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-destructive/15 border border-destructive/30 text-destructive text-xs rounded-lg text-center font-medium"
                            >
                                {validationError || error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Username
                                </label>
                                <Input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="bg-background border-border focus-visible:ring-primary"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="bg-background border-border focus-visible:ring-primary"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full font-bold cursor-pointer transition-all duration-200"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : isSignUp ? (
                                    "Sign Up"
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2 pt-2 pb-4">
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setValidationError("");
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors cursor-pointer"
                        >
                            {isSignUp
                                ? "Already have an account? Sign In"
                                : "Need an account? Sign Up"}
                        </button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default Auth;
