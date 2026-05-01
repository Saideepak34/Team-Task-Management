import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppShell from '../components/AppShell';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { projectAPI, taskAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProjects();
      setProjects(response.data.projects);
      
      // Fetch tasks for each project
      const tasksMap = {};
      for (const project of response.data.projects) {
        try {
          const tasksRes = await taskAPI.getProjectTasks(project._id);
          tasksMap[project._id] = tasksRes.data.tasks || [];
        } catch (err) {
          tasksMap[project._id] = [];
        }
      }
      setProjectTasks(tasksMap);
    } catch (err) {
      toast.error('Unable to load projects.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.createProject(formData);
      toast.success('Project created successfully');
      setFormData({ name: '', description: '' });
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      toast.error('Unable to create project');
      console.error(err);
    }
  };

  const isProjectCreator = (project) => project.createdBy?._id === user?._id;
  const isAdmin = user?.role === 'admin';

  return (
    <AppShell title="Projects">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Projects</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Manage your active projects</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button onClick={() => setShowModal(true)}>Create Project</Button>
        </div>
      </div>

      <Modal
        open={showModal}
        title="Create Project"
        description="Add a new project and start assigning tasks to your team."
        onClose={() => setShowModal(false)}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Project</Button>
          </div>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Design system revamp"
            required
          />
          <Input
            as="textarea"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add context and goals for this project"
          />
        </form>
      </Modal>

      {loading ? (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-md">
          <p className="text-slate-500">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-md">
          <p className="text-lg font-semibold text-slate-900">No projects yet</p>
          <p className="mt-2 text-slate-500">Create your first project and start assigning tasks to the team.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {projects.map((project) => {
            const tasks = projectTasks[project._id] || [];
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.status === 'Completed').length;
            const canManageTasks = isAdmin || isProjectCreator(project);
            
            return (
              <Card key={project._id} className="p-6 hover:shadow-lg transition flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900">{project.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{project.description || 'No description added yet.'}</p>
                  
                  {/* Task Info */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                      <span className="text-sm font-medium text-slate-600">Total Tasks:</span>
                      <span className="text-lg font-semibold text-slate-900">{totalTasks}</span>
                    </div>
                    
                    {totalTasks > 0 && (
                      <>
                        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-3">
                          <span className="text-sm font-medium text-emerald-700">Completed:</span>
                          <span className="text-lg font-semibold text-emerald-900">{completedTasks}/{totalTasks}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  <div className="mb-4 flex flex-col gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <strong className="text-slate-900">Members:</strong> {project.members?.length || 0}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <strong className="text-slate-900">Owner:</strong> {project.createdBy?.name || 'Unknown'}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {canManageTasks && (
                      <Button
                        className="flex-1"
                        onClick={() => navigate(`/tasks/${project._id}`)}
                      >
                        Manage Tasks
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => navigate(`/tasks/${project._id}`)}
                    >
                      View Tasks
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
};

export default ProjectsPage;
