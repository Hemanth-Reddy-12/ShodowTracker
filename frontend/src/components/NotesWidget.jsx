import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../store/authStore";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const NotesWidget = ({ notes, userId, onUpdate }) => {
  const [content, setContent] = useState("");

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await axios.post(`${API_URL}/user/notes`, { content, userId });
      setContent("");
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/user/notes/${id}`);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <StickyNote size={20} className="text-primary" />
        <h2 className="text-xl font-bold font-display text-foreground">
          Journal
        </h2>
      </div>

      <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Write a quick note..."
          className="flex-1 bg-background border-border"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" size="icon" className="cursor-pointer">
          <Plus size={18} />
        </Button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {notes.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground text-sm text-center mt-4"
            >
              No notes yet. Jot down your thoughts!
            </motion.p>
          ) : (
            [...notes]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-start justify-between p-3 bg-secondary/30 rounded-lg group border border-border/50 hover:border-border transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                      {note.content}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {format(new Date(note.createdAt), "MMM d, yyyy · h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteNote(note.id)}
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all cursor-pointer ml-2 flex-shrink-0"
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

export default NotesWidget;
