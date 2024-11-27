import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import TodoList from "./components/TodoList";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProfileDashboard from "./components/profile/ProfileDashboard";
import HomePage from "./components/HomePage";
import { useAuth } from "./context/AuthContext";

export const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
	const { isAuthenticated } = useAuth();

	return (
		<Router>
			<Navbar />
			<Container maxW="container.xl" py={8}>
				<Routes>
					<Route path="/home" element={<HomePage />} />
					<Route 
						path="/login" 
						element={isAuthenticated ? <Navigate to="/tasks" /> : <LoginForm />} 
					/>
					<Route 
						path="/register" 
						element={isAuthenticated ? <Navigate to="/tasks" /> : <RegisterForm />} 
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<ProfileDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/tasks"
						element={
							<ProtectedRoute>
								<TodoList />
							</ProtectedRoute>
						}
					/>
					<Route path="/" element={<Navigate to="/home" />} />
				</Routes>
			</Container>
		</Router>
	);
}

export default App;
