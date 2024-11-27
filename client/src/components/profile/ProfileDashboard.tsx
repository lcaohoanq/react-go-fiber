import {
  Box,
  Container,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  VStack,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  List,
  ListItem,
  Badge,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../App";
import { Todo } from "../TodoList";

type UserStats = {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
  completionRate: number;
  recentTodos: Todo[];
};

type ProfileData = {
  user: {
    name: string;
    email: string;
    role: string;
  };
  stats: UserStats;
};

const ProfileDashboard = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const { data, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
  });

  if (isLoading) return <Progress size="xs" isIndeterminate />;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* User Info Section */}
        <Box>
          <Heading size="lg" mb={4}>
            My Profile
          </Heading>
          <Card>
            <CardHeader>
              <Heading size="md">User Information</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Stat>
                  <StatLabel>Name</StatLabel>
                  <StatNumber>{data?.user.name}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Email</StatLabel>
                  <StatNumber fontSize="lg">{data?.user.email}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Role</StatLabel>
                  <StatNumber>
                    <Badge colorScheme="green" fontSize="md">
                      {data?.user.role}
                    </Badge>
                  </StatNumber>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>
        </Box>

        {/* Statistics Section */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Todo Statistics</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Stat>
                  <Box>
                    <StatLabel>Completion Rate</StatLabel>
                    <Progress
                      value={data?.stats.completionRate}
                      colorScheme="green"
                      size="lg"
                      borderRadius="md"
                    />
                    <StatHelpText>
                      {data?.stats.completionRate.toFixed(1)}% Complete
                    </StatHelpText>
                  </Box>
                </Stat>
                <SimpleGrid columns={2} spacing={4}>
                  <Stat>
                    <StatLabel>Total Todos</StatLabel>
                    <StatNumber>{data?.stats.totalTodos}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Completed</StatLabel>
                    <StatNumber>{data?.stats.completedTodos}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Recent Activity</Heading>
            </CardHeader>
            <CardBody>
              <List spacing={3}>
                {data?.stats.recentTodos.map((todo) => (
                  <ListItem key={todo.ID}>
                    <Text>
                      {todo.body}{" "}
                      <Badge
                        colorScheme={todo.completed ? "green" : "yellow"}
                        ml={2}
                      >
                        {todo.completed ? "Completed" : "Pending"}
                      </Badge>
                    </Text>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Task Status</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Stat>
                  <StatLabel>Pending Tasks</StatLabel>
                  <StatNumber>{data?.stats.pendingTodos}</StatNumber>
                  <Progress
                    value={
                      ((data?.stats.pendingTodos || 0) /
                        (data?.stats.totalTodos || 1)) *
                      100
                    }
                    colorScheme="yellow"
                    size="sm"
                  />
                </Stat>
                <Stat>
                  <StatLabel>Completed Tasks</StatLabel>
                  <StatNumber>{data?.stats.completedTodos}</StatNumber>
                  <Progress
                    value={
                      ((data?.stats.completedTodos || 0) /
                        (data?.stats.totalTodos || 1)) *
                      100
                    }
                    colorScheme="green"
                    size="sm"
                  />
                </Stat>
              </VStack>
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Container>
  );
};

export default ProfileDashboard;
