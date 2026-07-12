import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../store/authStore";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, Target, Trophy } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

const GoalsWidget = ({ goals, userId, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("tasks");
  const [deadline, setDeadline] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!title.trim() || !targetValue) return;
    try {
      await axios.post(`${API_URL}/user/goals`, {
        title,
        targetValue: parseInt(targetValue),
        unit,
        deadline: deadline || null,
        userId,
      });
      setTitle("");
      setTargetValue("");
      setUnit("tasks");
      setDeadline("");
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const updateProgress = async (id, currentValue, delta, goalTargetValue) => {
    const newValue = Math.max(0, Math.min(currentValue + delta, goalTargetValue));
    try {
      await axios.put(`${API_URL}/user/goals/${id}`, {
        currentValue: newValue,
      });
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`${API_URL}/user/goals/${id}`);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Target size={20} className="text-primary" />
          <h2 className="text-xl font-bold font-display text-foreground">
            Goals
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="gap-1 cursor-pointer text-xs border-border"
        >
          <Plus size={14} />
          New Goal
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddGoal}
            className="space-y-2 mb-4 overflow-hidden"
          >
            <Input
              type="text"
              placeholder="Goal title (e.g. Complete 10 tasks)"
              className="bg-background border-border"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Target"
                className="w-20 bg-background border-border"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Unit (tasks, $, days)"
                className="flex-1 bg-background border-border"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              <Input
                type="date"
                className="w-[130px] bg-background border-border text-xs"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm" className="w-full cursor-pointer">
              Create Goal
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence>
          {goals.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground text-sm text-center mt-4"
            >
              No goals set. Aim for something!
            </motion.p>
          ) : (
            goals.map((goal) => {
              const pct = Math.min(
                100,
                Math.round((goal.currentValue / goal.targetValue) * 100)
              );
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 bg-secondary/30 rounded-xl border border-border/50 hover:border-border transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {goal.completed ? (
                        <Trophy size={16} className="text-primary flex-shrink-0" />
                      ) : (
                        <Target size={16} className="text-muted-foreground flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm font-medium truncate ${goal.completed ? "text-primary line-through" : "text-foreground"}`}
                      >
                        {goal.title}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-secondary rounded-full h-2 mb-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${goal.completed ? "bg-primary" : "bg-primary/70"}`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] py-0 px-1.5 font-medium ${goal.completed ? "border-primary/30 text-primary" : "border-border text-muted-foreground"}`}
                      >
                        {pct}%
                      </Badge>
                      {goal.deadline && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 border-border text-muted-foreground font-normal"
                        >
                          {format(new Date(goal.deadline), "MMM d")}
                        </Badge>
                      )}
                    </div>

                    {!goal.completed && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            updateProgress(goal.id, goal.currentValue, -1, goal.targetValue)
                          }
                          className="h-6 w-6 cursor-pointer border-border"
                        >
                          <Minus size={12} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            updateProgress(goal.id, goal.currentValue, 1, goal.targetValue)
                          }
                          className="h-6 w-6 cursor-pointer border-border"
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GoalsWidget;
