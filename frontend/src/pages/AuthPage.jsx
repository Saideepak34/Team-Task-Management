import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';

const AuthPage = ({ isLogin = true }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        toast.error('Passwords do not match');
        setLoading(false);
        return;
      }

      const response = isLogin
        ? await authAPI.login({
            email: formData.email,
            password: formData.password,
          })
        : await authAPI.signup({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });

      const { token, user } = response.data;
      login(user, token);
      toast.success(`${isLogin ? 'Welcome back' : 'Account created'}!`);
      navigate('/dashboard');
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;
      const validationMessage = Array.isArray(validationErrors)
        ? validationErrors[0]?.msg
        : null;
      const message =
        apiMessage || validationMessage || 'An error occurred. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Team Task Manager</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">{isLogin ? 'Login' : 'Create account'}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {isLogin ? 'Access your workspace and manage your team tasks.' : 'Create your account and start collaborating.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <Input
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          {!isLogin && (
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          {isLogin ? 'New here?' : 'Already have an account?'}
          <Link to={isLogin ? '/signup' : '/login'} className="ml-2 font-semibold text-sky-600 hover:text-sky-700">
            {isLogin ? 'Create account' : 'Login'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
