import React, { useEffect, useState, useCallback, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuthStore, API_URL } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import axios from "axios";
import { toast } from "sonner";
import { startOfDay, isAfter } from "date-fns";
import TasksWidget from "../components/TasksWidget";
import ExpenseWidget from "../components/ExpenseWidget";
import HeatmapWidget from "../components/HeatmapWidget";
import ProfileWidget from "../components/ProfileWidget";
import AnalyticsWidget from "../components/AnalyticsWidget";
import NotesWidget from "../components/NotesWidget";
import GoalsWidget from "../components/GoalsWidget";
import ExpenseChartWidget from "../components/ExpenseChartWidget";
import { Button } from "../components/ui/button";
import { LogOut, Sun, Moon } from "lucide-react";

const Home = () => {
    const { user, id, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasNotified = useRef(false);

    const fetchProfile = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/user/profile/${id}`);
            setProfileData(data);
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchProfile();
        }
    }, [id, fetchProfile]);

    // Overdue task notifications
    useEffect(() => {
        if (!profileData?.tasks || hasNotified.current) return;
        hasNotified.current = true;

        const today = startOfDay(new Date());
        const overdueTasks = profileData.tasks.filter(
            (t) =>
                !t.completed &&
                t.dueDate &&
                isAfter(today, startOfDay(new Date(t.dueDate)))
        );

        if (overdueTasks.length > 0) {
            setTimeout(() => {
                if (overdueTasks.length === 1) {
                    toast.warning(`Overdue: "${overdueTasks[0].title}"`, {
                        description: "This task is past its due date.",
                    });
                } else {
                    toast.warning(
                        `${overdueTasks.length} overdue tasks`,
                        {
                            description: overdueTasks
                                .slice(0, 3)
                                .map((t) => t.title)
                                .join(", ") +
                                (overdueTasks.length > 3 ? "..." : ""),
                        }
                    );
                }
            }, 1000);
        }
    }, [profileData]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-muted-foreground">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                    }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex justify-between items-center"
            >
                <div>
                    <h1 className="text-4xl font-bold text-foreground">
                        Welcome back,{" "}
                        <span className="text-primary">{user}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here is your activity overview.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="cursor-pointer border-border"
                    >
                        {theme === "dark" ? (
                            <Sun size={16} />
                        ) : (
                            <Moon size={16} />
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={logout}
                        className="gap-2 cursor-pointer border-border hover:text-red-500"
                    >
                        <LogOut size={16} />
                        Logout
                    </Button>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Row 1: Profile + Heatmap */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="dashboard-card lg:col-span-1 md:col-span-2 flex flex-col justify-between"
                >
                    <ProfileWidget
                        profile={profileData}
                        userId={id}
                        onUpdate={fetchProfile}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 md:col-span-2 dashboard-card flex flex-col justify-between"
                >
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-foreground">
                            Activity Heatmap
                        </h2>
                        <HeatmapWidget
                            tasks={profileData?.tasks || []}
                            expenses={profileData?.expenses || []}
                        />
                    </div>
                </motion.div>

                {/* Row 2: Analytics (full width) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="dashboard-card lg:col-span-4 md:col-span-2"
                >
                    <AnalyticsWidget
                        tasks={profileData?.tasks || []}
                        expenses={profileData?.expenses || []}
                    />
                </motion.div>

                {/* Row 3: Tasks + Expenses */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="dashboard-card flex flex-col h-[480px] lg:col-span-2 md:col-span-1"
                >
                    <TasksWidget
                        tasks={profileData?.tasks || []}
                        userId={id}
                        onUpdate={fetchProfile}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="dashboard-card flex flex-col h-[480px] lg:col-span-2 md:col-span-1"
                >
                    <ExpenseWidget
                        expenses={profileData?.expenses || []}
                        userId={id}
                        onUpdate={fetchProfile}
                    />
                </motion.div>

                {/* Row 4: Goals + Expense Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                    className="dashboard-card flex flex-col h-[420px] lg:col-span-2 md:col-span-1"
                >
                    <GoalsWidget
                        goals={profileData?.goals || []}
                        userId={id}
                        onUpdate={fetchProfile}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="dashboard-card flex flex-col h-[420px] lg:col-span-2 md:col-span-1"
                >
                    <ExpenseChartWidget
                        expenses={profileData?.expenses || []}
                    />
                </motion.div>

                {/* Row 5: Journal (full width) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="dashboard-card flex flex-col h-[400px] lg:col-span-4 md:col-span-2"
                >
                    <NotesWidget
                        notes={profileData?.notes || []}
                        userId={id}
                        onUpdate={fetchProfile}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
