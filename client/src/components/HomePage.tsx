import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Image,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box className="flex gap-3">
          <Image
            src="/react.png"
            width={70}
            height={70}
            alt="React Logo"
            boxSize="100px"
            objectFit="contain"
          />
          <Image
            src="/go.png"
            width={70}
            height={70}
            alt="Go Logo"
            boxSize="100px"
            objectFit="contain"
          />
          <Image
            src="/postgres.png"
            width={70}
            height={70}
            alt="Postgres Logo"
            boxSize="100px"
            objectFit="contain"
          />
        </Box>
        <Heading
          as="h1"
          size="2xl"
          bgGradient="linear(to-r, blue.400, teal.400)"
          bgClip="text"
        >
          Welcome to Todo App
        </Heading>
        <Text fontSize="xl" color={textColor} maxW="2xl">
          A modern, full-stack application built with Go, React, TypeScript, and
          ChakraUI. Manage your tasks efficiently with our intuitive interface.
        </Text>

        <Box py={8}>
          {isAuthenticated ? (
            <Flex gap={4}>
              <Button
                as={RouterLink}
                to="/profile"
                colorScheme="blue"
                size="lg"
                px={8}
              >
                View Profile
              </Button>
              <Button
                as={RouterLink}
                to="/"
                colorScheme="teal"
                size="lg"
                px={8}
              >
                My Tasks
              </Button>
            </Flex>
          ) : (
            <Flex gap={4}>
              <Button
                as={RouterLink}
                to="/login"
                colorScheme="blue"
                size="lg"
                px={8}
              >
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="teal"
                size="lg"
                px={8}
              >
                Register
              </Button>
            </Flex>
          )}
        </Box>

        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          width="full"
          maxW="4xl"
        >
          <VStack spacing={4}>
            <Heading size="md">Features</Heading>
            <Flex
              wrap="wrap"
              gap={4}
              justify="center"
              textAlign="left"
              width="full"
            >
              <Feature
                title="Task Management"
                text="Create, update, and delete tasks"
              />
              <Feature
                title="User Authentication"
                text="Secure login and registration"
              />
              <Feature
                title="Dark Mode"
                text="Toggle between light and dark themes"
              />
              <Feature title="Responsive Design" text="Works on all devices" />
            </Flex>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

const Feature = ({ title, text }: { title: string; text: string }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" width="300px">
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4}>{text}</Text>
    </Box>
  );
};

export default HomePage;
