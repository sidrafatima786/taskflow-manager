import { useAuth } from "@/context/AuthContext";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  async function fetchTasks() {
    try {
      const res = await fetch("http://localhost:5000/api/tasks");
      const data = await res.json();

      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function createTask() {
    try {
      await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          description,
          priority: "medium",
          status: "pending",
          assignedTo,
        }),
      });

      setShowModal(false);

      setTitle("");
      setDescription("");
      setAssignedTo("");

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">Tasks</h1>

          <p className="text-gray-500 mt-2">
            Manage and track your tasks.
          </p>
        </div>
      {user?.role === "admin" && (
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl"
        >
          + New Task
        </button>
      )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task: any) => (
          <div
            key={task._id}
            className="rounded-2xl border p-5 shadow-sm bg-white dark:bg-[#111827]"
          >
            <h2 className="text-2xl font-semibold mb-2">
              {task.title}
            </h2>

            <p className="text-gray-500 mb-3">
              {task.description}
            </p>

            {task.assignedTo && (
              <p className="text-sm text-purple-600 mb-3">
                Assigned to: {task.assignedTo.name || "User"}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-500 font-medium capitalize">
                {task.priority}
              </span>

              <button
                onClick={async () => {
                  await fetch(
                    `http://localhost:5000/api/tasks/${task._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },

                      body: JSON.stringify({
                        status:
                          task.status === "pending"
                            ? "completed"
                            : "pending",
                      }),
                    }
                  );

                  fetchTasks();
                }}
                className={`text-sm font-medium capitalize px-3 py-1 rounded-xl ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {task.status}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl w-[400px]">
            <h2 className="text-3xl font-bold mb-5">
              Create Task
            </h2>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-4"
            />

            <textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-4 h-32"
            />

            <input
              type="text"
              placeholder="Assign user ID"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={createTask}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}