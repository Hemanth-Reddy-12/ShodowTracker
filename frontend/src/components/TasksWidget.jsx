import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../store/authStore";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

const TasksWidget = ({ tasks, userId, onUpdate }) => {
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await axios.post(`${API_URL}/user/tasks`, {
        title: newTask,
        dueDate: dueDate || null,
        userId,
      });
      setNewTask("");
      setDueDate("");
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/user/tasks/${id}`, { completed: !completed });
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/user/tasks/${id}`);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 font-display text-foreground">Daily Tasks</h2>
      
      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <Input 
          type="text" 
          placeholder="New task..." 
          className="flex-1 bg-background border-border"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Input 
          type="date"
          className="w-[130px] bg-background border-border text-xs"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Button type="submit" size="icon" className="cursor-pointer">
          <Plus size={18} />
        </Button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground text-sm text-center mt-4">
              No tasks yet. Stay productive!
            </motion.p>
          ) : (
            tasks.map(task => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg group border border-border/50 hover:border-border transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all flex-shrink-0 cursor-pointer ${task.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 text-transparent hover:border-primary/50'}`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </button>
                  <div className="truncate">
                    <p className={`text-sm font-medium truncate transition-all ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-border/80 text-muted-foreground gap-1 font-normal">
                          <Calendar size={10} /> {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  onClick={() => deleteTask(task.id)} 
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                </Button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TasksWidget;
