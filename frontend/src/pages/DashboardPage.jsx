import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyTask = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, clearSession } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adminStats, setAdminStats] = useState(null);

  const submitLabel = useMemo(
    () => (editingId ? "Update Task" : "Create Task"),
    [editingId]
  );

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.data || []);
    } catch (apiError) {
      if (apiError.response?.status === 401) {
        clearSession();
        navigate("/login", { replace: true });
        return;
      }
      setError(getApiErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setTaskForm(emptyTask);
    setEditingId(null);
  };

  const onTaskInput = (event) => {
    setTaskForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submitTask = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      if (editingId) {
        await api.patch(`/tasks/${editingId}`, taskForm);
        setMessage("Task updated successfully.");
      } else {
        await api.post("/tasks", taskForm);
        setMessage("Task created successfully.");
      }
      resetForm();
      await loadTasks();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    }
  };

  const editTask = (task) => {
    setEditingId(task._id);
    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "pending",
      priority: task.priority || "medium",
    });
    setMessage("");
    setError("");
  };

  const removeTask = async (taskId) => {
    setMessage("");
    setError("");
    try {
      await api.delete(`/tasks/${taskId}`);
      setMessage("Task deleted successfully.");
      await loadTasks();
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    }
  };

  const fetchAdminStats = async () => {
    setMessage("");
    setError("");
    try {
      const response = await api.get("/admin/stats");
      setAdminStats(response.data.data);
      setMessage("Admin stats loaded.");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Task Dashboard</h1>
          <p>
            Signed in as <strong>{user?.name}</strong> ({user?.role})
          </p>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="card">
        <h2>{editingId ? "Edit Task" : "Create Task"}</h2>
        <form className="task-form" onSubmit={submitTask}>
          <input
            type="text"
            name="title"
            value={taskForm.title}
            onChange={onTaskInput}
            required
            placeholder="Title"
          />
          <textarea
            name="description"
            value={taskForm.description}
            onChange={onTaskInput}
            placeholder="Description"
            rows={3}
          />
          <div className="form-row">
            <select name="status" value={taskForm.status} onChange={onTaskInput}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select name="priority" value={taskForm.priority} onChange={onTaskInput}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-row">
            <button className="btn-primary" type="submit">
              {submitLabel}
            </button>
            {editingId ? (
              <button className="btn-secondary" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      {message ? <p className="message success">{message}</p> : null}
      {error ? <p className="message error">{error}</p> : null}

      {user?.role === "admin" ? (
        <section className="card">
          <div className="admin-row">
            <h2>Admin Controls</h2>
            <button className="btn-secondary" onClick={fetchAdminStats}>
              Load Stats
            </button>
          </div>
          {adminStats ? (
            <p>
              Users: {adminStats.users} | Tasks: {adminStats.tasks} | Completed:{" "}
              {adminStats.completedTasks}
            </p>
          ) : (
            <p>Load statistics to test role-based admin endpoint.</p>
          )}
        </section>
      ) : null}

      <section className="card">
        <h2>Your Tasks</h2>
        {loading ? <p>Loading tasks...</p> : null}
        {!loading && tasks.length === 0 ? <p>No tasks yet.</p> : null}
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <div>
                <h3>{task.title}</h3>
                <p>{task.description || "No description"}</p>
                <small>
                  Status: {task.status} | Priority: {task.priority}
                </small>
              </div>
              <div className="task-actions">
                <button className="btn-secondary" onClick={() => editTask(task)}>
                  Edit
                </button>
                <button className="btn-danger" onClick={() => removeTask(task._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default DashboardPage;

