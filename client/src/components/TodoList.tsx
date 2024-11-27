import { VStack, Heading, Box, Text, Spinner, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import { BASE_URL } from "../App";

export type Todo = {
  ID: number;
  body: string;
  completed: boolean;
};

const TodoList = () => {
  const token = localStorage.getItem("token");

  const {
    data: todos,
    isLoading,
    error,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch todos");
      }
      return res.json();
    },
  });

  if (error) {
    return (
      <Center>
        <Text color="red.500">Error: {error.message}</Text>
      </Center>
    );
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading size="lg">TODAY'S TASKS</Heading>

        {/* Add TodoForm here */}
        <TodoForm />

        {isLoading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : todos && todos.length > 0 ? (
          todos.map((todo) => <TodoItem key={todo.ID} todo={todo} />)
        ) : (
          <Text textAlign="center" color="gray.500">
            No tasks yet. Add one above!
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default TodoList;
