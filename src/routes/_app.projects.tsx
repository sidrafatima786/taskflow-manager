import { useAuth } from "@/context/AuthContext";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedMembers, setSelectedMembers] =
    useState<string[]>([]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/projects"
      );

      const data = await res.json();

      if (user?.role === "admin") {
        setProjects(data);
      } else {
        const filtered = data.filter(
          (project: any) =>
            project.members?.some(
              (member: any) =>
                member._id === user?.id
            )
        );

        setProjects(filtered);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/users"
      );

      const data = await res.json();

      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();

    fetchUsers();
  }, []);

  const createProject = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            description,
            members: selectedMembers,
          }),
        }
      );

      if (res.ok) {
        setName("");

        setDescription("");

        setSelectedMembers([]);

        setShowModal(false);

        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">
            Projects
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your projects and team
            collaboration.
          </p>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl"
          >
            + New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <div
            key={project._id}
            className="rounded-2xl border p-5 shadow-sm bg-white dark:bg-[#111827]"
          >
            <h2 className="text-2xl font-semibold mb-2">
              {project.name}
            </h2>

            <p className="text-gray-500 mb-4">
              {project.description}
            </p>

            <p className="text-sm text-blue-600 mb-4">
              Team Members:{" "}
              {project.members?.length || 0}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-600 font-medium">
                Active
              </span>

              <button
                className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg"
                onClick={() => {
                  window.location.href = `/tasks?project=${project._id}`;
                }}
              >
                View Tasks
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl w-[450px]">
            <h2 className="text-2xl font-bold mb-4">
              Create Project
            </h2>

            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-lg p-3 mb-4"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border rounded-lg p-3 mb-4"
            />

            <div className="mb-4">
              <p className="font-medium mb-2">
                Select Team Members
              </p>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {users
                  .filter(
                    (u: any) =>
                      u.role === "member"
                  )
                  .map((u: any) => (
                    <label
                      key={u._id}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        value={u._id}
                        onChange={(e) => {
                          if (
                            e.target.checked
                          ) {
                            setSelectedMembers([
                              ...selectedMembers,
                              u._id,
                            ]);
                          } else {
                            setSelectedMembers(
                              selectedMembers.filter(
                                (id) =>
                                  id !== u._id
                              )
                            );
                          }
                        }}
                      />

                      <span>
                        {u.name} ({u.email})
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={createProject}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
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