import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppShell from '../components/AppShell';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { taskAPI, projectAPI, authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatDate, isOverdue } from '../utils/helpers';

const TasksPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: [],
    deadline: '',
  });

  const isProjectView = Boolean(projectId);
  const isAdmin = user?.role === 'admin';
  const isProjectCreator = project?.createdBy?._id === user?._id;

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      if (isProjectView) {
        const [projectRes, tasksRes, usersRes] = await Promise.all([
          projectAPI.getProjectById(projectId),
          taskAPI.getProjectTasks(projectId),
          authAPI.getAllUsers(),
        ]);
        setProject(projectRes.data.project);
        setTasks(tasksRes.data.tasks);
        setUsers(usersRes.data.users);
      } else {
        const response = await taskAPI.getUserTasks();
        setTasks(response.data.tasks);
        setProject(null);
      }
    } catch (err) {
      setError('Unable to load tasks');
      toast.error('Unable to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignedToChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData((prev) => ({ ...prev, assignedTo: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const canCreateTask = isAdmin || isProjectCreator;
      if (!canCreateTask) {
        toast.error('Only admins or project creator can create tasks');
        return;
      }
      if (formData.assignedTo.length === 0) {
        toast.error('Please assign task to at least one person');
        return;
      }
      await taskAPI.createTask({ ...formData, projectId });
      toast.success('Task created successfully');
      setFormData({ title: '', description: '', assignedTo: [], deadline: '' });
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create task');
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      toast.success('Task updated');
      fetchTasks();
    } catch (err) {
      toast.error('Unable to update task');
      console.error(err);
    }
  };

  const pageTitle = isProjectView ? `Project: ${project?.name || 'Loading...'}` : 'My Tasks';

  return (
    <AppShell title="Tasks">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Tasks</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{pageTitle}</h2>
          {isProjectView && project?.description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{project.description}</p>
          )}
          {isProjectView && project && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Project Status:</span>
                <Badge status={project.status} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">Progress:</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-40 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-sky-500 transition-all"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{project.progress || 0}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
          {isProjectView && (isAdmin || isProjectCreator) && (
            <Button onClick={() => setShowModal(true)}>Create Task</Button>
          )}
        </div>
      </div>

      {!isAdmin && !isProjectCreator && isProjectView && (
        <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Only the project creator or admins can create tasks. Contact your project admin to assign you a task.
          </p>
        </div>
      )}

      <Modal
        open={showModal}
        title="Create Task"
        description="Add a new task and assign it to team members."
        onClose={() => setShowModal(false)}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Task</Button>
          </div>
        }
      >
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Add task title"
            required
          />
          <Input
            as="textarea"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write task details"
            rows="2"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Assign To (Multiple)</label>
            <select
              multiple
              size={4}
              value={formData.assignedTo}
              onChange={handleAssignedToChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none transition duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 max-h-[120px] overflow-y-auto"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
            {formData.assignedTo.length > 0 && (
              <div className="mt-2 max-h-[80px] overflow-y-auto flex flex-wrap gap-1">
                {formData.assignedTo.map((userId) => {
                  const user = users.find(u => u._id === userId);
                  return (
                    <span key={userId} className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-800 whitespace-nowrap">
                      {user?.name}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, assignedTo: prev.assignedTo.filter(id => id !== userId) }))}
                        className="ml-1 font-bold hover:opacity-70"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <Input
            label="Deadline"
            type="datetime-local"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </form>
      </Modal>

      {loading ? (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-md">
          <p className="text-slate-500">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-md">
          <p className="text-lg font-semibold text-slate-900">No tasks found</p>
          <p className="mt-2 text-slate-500">
            {isAdmin && isProjectView
              ? 'Create your first task by clicking the "Create Task" button above.'
              : 'You have no assigned tasks at the moment.'}
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {tasks.map((task) => (
            <Card key={task._id} className="p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-slate-900">{task.title}</h3>
                    <Badge status={task.status} />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{task.description || 'No description provided.'}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <span className="block text-slate-400">Assigned To</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 ? (
                          task.assignedTo.map((assignee) => (
                            <span
                              key={assignee._id}
                              className="inline-flex rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-800"
                            >
                              {assignee.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-900 font-semibold">Unassigned</span>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <span className="block text-slate-400">Project</span>
                      <p className="mt-2 font-semibold text-slate-900">{task.projectId?.name || 'Unknown'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <span className="block text-slate-400">Deadline</span>
                      <p className="mt-2 font-semibold text-slate-900">
                        {task.deadline ? formatDate(task.deadline) : 'No deadline'}
                        {task.deadline && isOverdue(task.deadline) && task.status !== 'Completed' ? ' • Overdue' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex min-w-[220px] items-end justify-end">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
};

export default TasksPage;
