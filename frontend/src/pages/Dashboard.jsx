import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle2, Clock3 } from 'lucide-react';
import toast from 'react-hot-toast';
import AppShell from '../components/AppShell';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { taskAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatDate, isOverdue } from '../utils/helpers';

const statsConfig = [
  { key: 'totalTasks', label: 'Total Tasks', icon: Activity, color: 'text-sky-600' },
  { key: 'completedTasks', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
  { key: 'pendingTasks', label: 'Pending', icon: Clock3, color: 'text-amber-600' },
  { key: 'overdueTasks', label: 'Overdue', icon: Clock3, color: 'text-rose-600' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getUserTasks();
      setTasks(response.data.tasks);
      setStats(response.data.stats);
    } catch (err) {
      toast.error('Unable to load tasks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      toast.success('Task status updated');
      fetchTasks();
    } catch (err) {
      toast.error('Unable to update task');
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'Completed';
    if (filter === 'pending') return task.status === 'Pending';
    if (filter === 'overdue') return isOverdue(task.deadline) && task.status !== 'Completed';
    return true;
  });

  return (
    <AppShell title="Dashboard">
      <div className="grid gap-6 xl:grid-cols-4">
        {statsConfig.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.key} className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{stats ? stats[item.key] : '—'}</p>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                  <Icon className={item.color + ' h-6 w-6'} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">My tasks</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {user?.name ? `Welcome back, ${user.name}` : 'Your tasks'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate('/projects')}>
              View Projects
            </Button>
            <Button variant="ghost" onClick={() => navigate('/tasks')}>
              View Tasks
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {['all', 'pending', 'in-progress', 'completed', 'overdue'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === option
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-md">
            <p className="text-slate-500">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-md">
            <p className="text-lg font-semibold text-slate-900">No tasks assigned yet</p>
            <p className="mt-2 text-slate-500">Assigned tasks will appear here once they are created.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task._id} className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-slate-900">{task.title}</p>
                      <Badge status={task.status} />
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{task.description || 'No description provided.'}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                        <span className="block text-slate-400">Project</span>
                        <span className="mt-2 block font-semibold text-slate-900">{task.projectId?.name || 'Unknown'}</span>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                        <span className="block text-slate-400">Assigned to</span>
                        <span className="mt-2 block font-semibold text-slate-900">{task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                        <span className="block text-slate-400">Deadline</span>
                        <span className="mt-2 block font-semibold text-slate-900">
                          {task.deadline ? formatDate(task.deadline) : 'No deadline'}
                          {task.deadline && isOverdue(task.deadline) && task.status !== 'Completed' ? ' • Overdue' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full min-w-[220px] items-end justify-end">
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
      </section>
    </AppShell>
  );
};

export default Dashboard;
