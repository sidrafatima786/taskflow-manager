import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export type TaskStatus = "pending" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Task[]>("/tasks");
      setTasks(data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (payload: Partial<Task>) => {
    const { data } = await api.post<Task>("/tasks", payload);
    setTasks((p) => [data, ...p]);
    toast.success("Task created");
  };

  const updateTask = async (id: string, payload: Partial<Task>) => {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload);
    setTasks((p) => p.map((t) => (t._id === id ? data : t)));
  };

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks((p) => p.filter((t) => t._id !== id));
    toast.success("Task deleted");
  };

  const toggleTask = async (task: Task) => {
    await updateTask(task._id, {
      status: task.status === "completed" ? "pending" : "completed",
    });
  };

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, toggleTask };
}
