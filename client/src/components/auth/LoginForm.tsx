import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Login</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Login
            </Button>
          </VStack>
        </form>
        <Text textAlign="center">
          Don't have an account?{" "}
          <Link as={RouterLink} to="/register" color="blue.500">
            Register here
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default LoginForm;
