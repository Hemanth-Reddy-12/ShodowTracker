import { Routes, Route, Navigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import NotFound from "./pages/NotFound.jsx";
import RouteWatcher from "./store/RouteWatcher.js";
import { useAuthStore } from "./store/authStore.js";
import { useThemeStore } from "./store/themeStore.js";
import { useEffect } from "react";
import Loading from "./components/Loading.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

const NavigatedRoute = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">{children}</div>
        </div>
    );
};

const App = () => {
    const { checkAuth, isCheckingAuth } = useAuthStore();
    const { initTheme } = useThemeStore();

    useEffect(() => {
        initTheme();
        checkAuth();
    }, [checkAuth, initTheme]);

    if (isCheckingAuth) {
        return <Loading />;
    }

    return (
        <TooltipProvider>
            <AnimatePresence>
                <motion.div className="min-h-screen relative overflow-hidden background">
                    <RouteWatcher />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <NavigatedRoute>
                                        <Home />
                                    </NavigatedRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
            <Toaster position="top-right" richColors />
        </TooltipProvider>
    );
};

export default App;
