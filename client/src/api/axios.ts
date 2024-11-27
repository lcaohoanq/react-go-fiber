import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
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