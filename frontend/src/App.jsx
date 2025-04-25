import { Routes, Route, Navigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "motion/react";
import Home from "./pages/Home.jsx";
import Verify from "./pages/Verify.jsx";
import Airdrop from "./pages/Airdrop.jsx";
import PageTracker from "./store/PageTracker.js";
import Reward from "./pages/Reward.jsx";
import Project from "./pages/Project.jsx";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import AddProject from "./pages/AddProject.jsx";
import Loading from "./components/Loading.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/verify2FA" replace />;
  }

  return children;
};

const NavigatedRoute = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
    </div>
  );
};

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loading />;
  }

  return (
    <AnimatePresence>
      <motion.div className="min-h-screen relative overflow-hidden background">
        <PageTracker />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/verify2FA" element={<Verify />} />
          <Route
            path="/airdrop"
            element={
              <ProtectedRoute>
                <NavigatedRoute />
                <Airdrop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <NavigatedRoute />
                <Reward />
              </ProtectedRoute>
            }
          />
          <Route
            path="/airdrop/project"
            element={
              <ProtectedRoute>
                <NavigatedRoute />
                <Project />
              </ProtectedRoute>
            }
          />
          <Route
            path="/airdrop/project/add"
            element={
              <ProtectedRoute>
                <NavigatedRoute />
                <AddProject />
              </ProtectedRoute>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
