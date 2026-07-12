import React, { useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  ListTodo,
  Flame,
} from "lucide-react";
import { startOfDay, subDays, isSameDay, isAfter } from "date-fns";

const StatCard = ({ icon, label, value, subtext, color, delay }) => {
  const IconComp = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 p-3 bg-secondary/30 rounded-2xl border border-border/50 hover:border-border transition-all duration-200"
    >
      <div className={`p-2 rounded-xl ${color}`}>
        <IconComp size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
        <p className="text-[11px] text-muted-foreground truncate">{label}</p>
        {subtext && (
          <p className="text-[10px] text-muted-foreground/70 truncate">{subtext}</p>
        )}
      </div>
    </motion.div>
  );
};

const AnalyticsWidget = ({ tasks, expenses }) => {
  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const last7 = subDays(today, 7);
    const last30 = subDays(today, 30);

    // --- Task stats ---
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Overdue: has a dueDate in the past and is not completed
    const overdueTasks = tasks.filter(
      (t) =>
        !t.completed &&
        t.dueDate &&
        isAfter(today, startOfDay(new Date(t.dueDate)))
    ).length;

    // --- Expense stats ---
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const last7Expenses = expenses.filter((e) =>
      isAfter(new Date(e.date), last7)
    );
    const weeklySpend = last7Expenses.reduce((sum, e) => sum + e.amount, 0);
    const last30Expenses = expenses.filter((e) =>
      isAfter(new Date(e.date), last30)
    );
    const monthlySpend = last30Expenses.reduce((sum, e) => sum + e.amount, 0);

    // Top category
    const catMap = {};
    expenses.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });
    const topCategory =
      Object.keys(catMap).length > 0
        ? Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]
        : null;

    // --- Streak: consecutive days with at least 1 completed task or expense ---
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d = subDays(today, i);
      const hasTask = tasks.some(
        (t) => t.completed && isSameDay(new Date(t.updatedAt), d)
      );
      const hasExpense = expenses.some((e) => isSameDay(new Date(e.date), d));
      if (hasTask || hasExpense) {
        streak++;
      } else if (i > 0) {
        // allow today to have no activity yet
        break;
      }
    }

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      overdueTasks,
      totalSpent,
      weeklySpend,
      monthlySpend,
      topCategory,
      streak,
    };
  }, [tasks, expenses]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 font-display text-foreground">
        Analytics
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completedTasks}
          subtext={`${stats.completionRate}% rate`}
          color="bg-primary/15 text-primary"
          delay={0.05}
        />
        <StatCard
          icon={ListTodo}
          label="Pending"
          value={stats.pendingTasks}
          subtext={
            stats.overdueTasks > 0
              ? `${stats.overdueTasks} overdue`
              : "All on track"
          }
          color={
            stats.overdueTasks > 0
              ? "bg-destructive/15 text-destructive"
              : "bg-accent/15 text-accent"
          }
          delay={0.1}
        />
        <StatCard
          icon={DollarSign}
          label="This Week"
          value={`$${stats.weeklySpend.toFixed(0)}`}
          subtext={`$${stats.monthlySpend.toFixed(0)} this month`}
          color="bg-electric-blue/15 text-electric-blue"
          delay={0.15}
        />
        <StatCard
          icon={TrendingUp}
          label="Top Category"
          value={stats.topCategory ? stats.topCategory[0] : "—"}
          subtext={
            stats.topCategory
              ? `$${stats.topCategory[1].toFixed(0)} spent`
              : "No data"
          }
          color="bg-amber-500/15 text-amber-400"
          delay={0.2}
        />
        <StatCard
          icon={Flame}
          label="Activity Streak"
          value={`${stats.streak}d`}
          subtext="Consecutive days"
          color="bg-orange-500/15 text-orange-400"
          delay={0.25}
        />
        <StatCard
          icon={Clock}
          label="Total Spent"
          value={`$${stats.totalSpent.toFixed(0)}`}
          subtext={`${stats.totalTasks} tasks total`}
          color="bg-purple-500/15 text-purple-400"
          delay={0.3}
        />
      </div>
    </div>
  );
};

export default AnalyticsWidget;
