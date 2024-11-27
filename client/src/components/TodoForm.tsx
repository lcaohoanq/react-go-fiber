/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { todoApi } from '../api/axios';

const TodoForm = () => {
	const [newTodo, setNewTodo] = useState("");

	const queryClient = useQueryClient();

	const { mutate: createTodo, isPending: isCreating } = useMutation({
		mutationFn: async (e: React.FormEvent) => {
			e.preventDefault();
			const { data } = await todoApi.createTodo(newTodo);
			setNewTodo("");
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
		onError: (error: any) => {
			alert(error.message);
		},
	});

	return (
		<form onSubmit={createTodo}>
			<Flex gap={2}>
				<Input
					type='text'
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					ref={(input) => input && input.focus()}
				/>
				<Button
					mx={2}
					type='submit'
					_active={{
						transform: "scale(.97)",
					}}
				>
					{isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
				</Button>
			</Flex>
		</form>
	);
};
export default TodoForm;

// STARTER CODE:

// import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
// import { useState } from "react";
// import { IoMdAdd } from "react-icons/io";

// const TodoForm = () => {
// 	const [newTodo, setNewTodo] = useState("");
// 	const [isPending, setIsPending] = useState(false);

// 	const createTodo = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		alert("Todo added!");
// 	};
// 	return (
// 		<form onSubmit={createTodo}>
// 			<Flex gap={2}>
// 				<Input
// 					type='text'
// 					value={newTodo}
// 					onChange={(e) => setNewTodo(e.target.value)}
// 					ref={(input) => input && input.focus()}
// 				/>
// 				<Button
// 					mx={2}
// 					type='submit'
// 					_active={{
// 						transform: "scale(.97)",
// 					}}
// 				>
// 					{isPending ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
// 				</Button>
// 			</Flex>
// 		</form>
// 	);
// };
// export default TodoForm;
