import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../store/authStore";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, DollarSign, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ExpenseWidget = ({ expenses, userId, onUpdate }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");

  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    try {
      await axios.post(`${API_URL}/user/expenses`, {
        amount: parseFloat(amount),
        category,
        description,
        userId,
      });
      setAmount("");
      setDescription("");
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/user/expenses/${id}`);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-display text-foreground">Expenses</h2>
        <Badge variant="secondary" className="text-sm font-semibold bg-emerald-primary/10 border-emerald-primary/30 text-emerald-primary">
          Total: ${total.toFixed(2)}
        </Badge>
      </div>

      <form onSubmit={handleAddExpense} className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="number" 
              step="0.01"
              placeholder="Amount" 
              className="pl-8 bg-background border-border"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[130px] bg-background border-border text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-border text-foreground">
              {categories.map(c => (
                <SelectItem key={c} value={c} className="hover:bg-muted focus:bg-muted text-xs cursor-pointer">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Input 
            type="text" 
            placeholder="Description (optional)" 
            className="flex-1 bg-background border-border"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" size="icon" className="cursor-pointer">
            <Plus size={18} />
          </Button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {expenses.length === 0 ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground text-sm text-center mt-4">
              No expenses recorded.
            </motion.p>
          ) : (
            expenses.map(exp => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg group border border-border/50 hover:border-border transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">${exp.amount.toFixed(2)}</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-border bg-background/50 text-muted-foreground font-normal">
                      {exp.category}
                    </Badge>
                  </div>
                  {exp.description && <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{exp.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{format(new Date(exp.date), "MMM d")}</span>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => deleteExpense(exp.id)} 
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExpenseWidget;
