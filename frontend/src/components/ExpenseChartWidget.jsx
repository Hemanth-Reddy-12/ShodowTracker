import React, { useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#22c55e", // emerald
  "#38bdf8", // sky
  "#f59e0b", // amber
  "#a855f7", // purple
  "#ef4444", // red
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-secondary border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs font-bold text-foreground">{data.name}</p>
        <p className="text-xs text-muted-foreground">
          ${data.value.toFixed(2)} ({data.payload.percent}%)
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseChartWidget = ({ expenses }) => {
  const chartData = useMemo(() => {
    const catMap = {};
    expenses.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });

    const total = Object.values(catMap).reduce((sum, v) => sum + v, 0);

    return Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        percent: total > 0 ? Math.round((value / total) * 100) : 0,
      }));
  }, [expenses]);

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon size={20} className="text-primary" />
          <h2 className="text-xl font-bold font-display text-foreground">
            Spending
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No expense data yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon size={20} className="text-primary" />
        <h2 className="text-xl font-bold font-display text-foreground">
          Spending
        </h2>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center gap-4 min-h-0">
        {/* Donut Chart */}
        <div className="w-full md:w-1/2 h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                ${total.toFixed(0)}
              </p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full md:w-1/2 space-y-2 overflow-y-auto max-h-[200px] pr-1">
          {chartData.map((entry, index) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-foreground truncate">
                  {entry.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-medium text-foreground">
                  ${entry.value.toFixed(0)}
                </span>
                <span className="text-[10px] text-muted-foreground w-8 text-right">
                  {entry.percent}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChartWidget;
