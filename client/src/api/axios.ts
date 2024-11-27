import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API functions
export const todoApi = {
    getTodos: () => api.get('/todos'),
    createTodo: (body: string) => api.post('/todos', { body }),
    updateTodo: (id: number) => api.patch(`/todos/${id}`),
    deleteTodo: (id: number) => api.delete(`/todos/${id}`),
}; 