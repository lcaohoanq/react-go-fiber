import {
	Box,
	Flex,
	Text,
	IconButton,
	Badge,
	Spinner,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "./TodoList";
import { BASE_URL } from "../App";

const TodoItem = ({ todo }: { todo: Todo }) => {
	const queryClient = useQueryClient();
	const token = localStorage.getItem("token");

	const { mutate: updateTodo, isPending: isUpdating } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${BASE_URL}/todos/${todo.ID}`, {
				method: "PATCH",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});
			if (!res.ok) {
				throw new Error("Failed to update todo");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${BASE_URL}/todos/${todo.ID}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});
			if (!res.ok) {
				throw new Error("Failed to delete todo");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	return (
		<Flex
			p={4}
			shadow="md"
			borderWidth="1px"
			borderRadius="lg"
			justify="space-between"
			align="center"
		>
			<Text
				color={todo.completed ? "gray.500" : "inherit"}
				textDecoration={todo.completed ? "line-through" : "none"}
			>
				{todo.body}
			</Text>
			<Flex gap={2}>
				<Badge
					colorScheme={todo.completed ? "green" : "yellow"}
					p={2}
					borderRadius="md"
				>
					{todo.completed ? "Completed" : "Pending"}
				</Badge>
				<IconButton
					aria-label="Mark as complete"
					icon={isUpdating ? <Spinner size="sm" /> : <FaCheckCircle />}
					colorScheme="green"
					variant="ghost"
					isDisabled={todo.completed}
					onClick={() => updateTodo()}
				/>
				<IconButton
					aria-label="Delete todo"
					icon={isDeleting ? <Spinner size="sm" /> : <MdDelete />}
					colorScheme="red"
					variant="ghost"
					onClick={() => deleteTodo()}
				/>
			</Flex>
		</Flex>
	);
};

export default TodoItem;
