import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// Get User Profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: { tasks: true, expenses: true, notes: true, goals: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Socials
router.put("/profile/:userId", async (req, res) => {
  try {
    const { githubUrl, twitterUrl, linkedinUrl } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.params.userId },
      data: { githubUrl, twitterUrl, linkedinUrl },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Tasks ───────────────────────────────────────────────

router.post("/tasks", async (req, res) => {
  try {
    const { title, dueDate, userId } = req.body;
    const task = await prisma.task.create({
      data: { title, dueDate: dueDate ? new Date(dueDate) : null, userId },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/tasks/:id", async (req, res) => {
  try {
    const { completed, title, dueDate } = req.body;
    const data = {};
    if (completed !== undefined) data.completed = completed;
    if (title !== undefined) data.title = title;
    if (dueDate !== undefined) data.dueDate = new Date(dueDate);

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data,
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Expenses ────────────────────────────────────────────

router.post("/expenses", async (req, res) => {
  try {
    const { amount, category, description, date, userId } = req.body;
    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
        description,
        date: date ? new Date(date) : new Date(),
        userId,
      },
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/expenses/:id", async (req, res) => {
  try {
    await prisma.expense.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Notes ───────────────────────────────────────────────

router.post("/notes", async (req, res) => {
  try {
    const { content, userId } = req.body;
    const note = await prisma.note.create({
      data: { content, userId },
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    await prisma.note.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Goals ───────────────────────────────────────────────

router.post("/goals", async (req, res) => {
  try {
    const { title, targetValue, unit, deadline, userId } = req.body;
    const goal = await prisma.goal.create({
      data: {
        title,
        targetValue: parseInt(targetValue),
        unit: unit || "tasks",
        deadline: deadline ? new Date(deadline) : null,
        userId,
      },
    });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/goals/:id", async (req, res) => {
  try {
    const { currentValue, completed } = req.body;
    const data = {};
    if (currentValue !== undefined) data.currentValue = parseInt(currentValue);
    if (completed !== undefined) data.completed = completed;

    // Auto-complete if currentValue >= targetValue
    if (currentValue !== undefined) {
      const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
      if (goal && parseInt(currentValue) >= goal.targetValue) {
        data.completed = true;
      }
    }

    const goal = await prisma.goal.update({
      where: { id: req.params.id },
      data,
    });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/goals/:id", async (req, res) => {
  try {
    await prisma.goal.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
