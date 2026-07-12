import React, { useMemo } from "react";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const ROWS = 4;

const HeatmapWidget = ({ tasks, expenses }) => {
    // Generate last 60 days
    const days = useMemo(() => {
        const today = startOfDay(new Date());
        const daysArray = [];
        for (let i = 59; i >= 0; i--) {
            daysArray.push(subDays(today, i));
        }
        return daysArray;
    }, []);

    const activityMap = useMemo(() => {
        const map = new Map();
        days.forEach((day) => {
            let score = 0;
            const dayTasks = tasks.filter(
                (t) => t.completed && isSameDay(new Date(t.updatedAt), day),
            );
            score += dayTasks.length * 2;
            const dayExpenses = expenses.filter((e) =>
                isSameDay(new Date(e.date), day),
            );
            score += dayExpenses.length;
            map.set(day.getTime(), {
                date: day,
                score,
                tasksCount: dayTasks.length,
                expensesCount: dayExpenses.length,
            });
        });
        return map;
    }, [days, tasks, expenses]);

    const getIntensityClass = (score) => {
        if (score === 0)
            return "bg-secondary/40 border border-border/40 hover:bg-secondary/60";
        if (score <= 2)
            return "bg-primary/20 border border-primary/10 hover:bg-primary/30";
        if (score <= 4)
            return "bg-primary/50 border border-primary/30 hover:bg-primary/60";
        return "bg-primary border border-primary/80 shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:scale-105";
    };

    // Group days into columns (ROWS days each), injecting a spacer at month boundaries
    const columns = useMemo(() => {
        const cols = [];
        const numCols = Math.ceil(days.length / ROWS);

        for (let col = 0; col < numCols; col++) {
            const colDays = days.slice(col * ROWS, col * ROWS + ROWS);
            const firstDay = colDays[0];
            // Insert a month-gap spacer when the first day of this column is the 1st of the month
            // (but not the very first column)
            const isMonthStart = col > 0 && firstDay.getDate() <= ROWS;
            cols.push({ days: colDays, isMonthStart, firstDay });
        }
        return cols;
    }, [days]);

    return (
        <div className="w-full overflow-x-auto pb-2">
            {/* Month labels row */}
            <div className="flex items-end mb-1.5 w-max">
                {columns.map((col, colIdx) => {
                    const showLabel =
                        col.isMonthStart ||
                        colIdx === 0;
                    return (
                        <div
                            key={colIdx}
                            className={`flex flex-col ${col.isMonthStart && colIdx > 0 ? "pl-3" : ""}`}
                            style={{ width: col.isMonthStart && colIdx > 0 ? "calc(1.5rem + 12px)" : "1.5rem" }}
                        >
                            {showLabel && (
                                <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                                    {format(col.firstDay, "MMM")}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Grid of cells */}
            <div className="flex items-start gap-x-0.5 w-max">
                {columns.map((col, colIdx) => (
                    <div
                        key={colIdx}
                        className={`flex flex-col gap-y-1.5 ${col.isMonthStart && colIdx > 0 ? "ml-3" : ""}`}
                    >
                        {col.days.map((day, i) => {
                            const activity = activityMap.get(day.getTime());
                            const globalIdx = colIdx * ROWS + i;
                            return (
                                <Tooltip key={day.getTime()}>
                                    <TooltipTrigger asChild>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: globalIdx * 0.005 }}
                                            className={`w-6 h-6 rounded-md transition-all duration-200 cursor-pointer ${getIntensityClass(activity.score)}`}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="bg-secondary border-border text-foreground p-3 rounded-lg shadow-xl"
                                        side="top"
                                        sideOffset={6}
                                    >
                                        <p className="font-bold mb-1 text-xs">
                                            {format(day, "MMM d, yyyy")}
                                        </p>
                                        {activity.score === 0 ? (
                                            <p className="text-muted-foreground text-[10px]">
                                                No activity
                                            </p>
                                        ) : (
                                            <div className="text-[10px] space-y-0.5">
                                                {activity.tasksCount > 0 && (
                                                    <p className="text-emerald-primary">
                                                        {activity.tasksCount} tasks completed
                                                    </p>
                                                )}
                                                {activity.expensesCount > 0 && (
                                                    <p className="text-electric-blue">
                                                        {activity.expensesCount} expenses logged
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex justify-end items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-secondary/40 border border-border/40"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/10"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/50 border border-primary/30"></div>
                <div className="w-3 h-3 rounded-sm bg-primary border border-primary/80"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default HeatmapWidget;
