import {
  Box,
  Flex,
  Button,
  useColorMode,
  Heading,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Box px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Link to="/">
          <Heading size="md">Todo App</Heading>
        </Link>

        <Flex alignItems="center" gap={4}>
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
          />

          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar size="sm" name={user?.name} />
              </MenuButton>
              <MenuList className="flex flex-col gap-3">
                <Link className="hover:font-bold" to="/">
                  <MenuItem>Home</MenuItem>
                </Link>
                <Link className="hover:font-bold" to="/profile">
                  <MenuItem>My Profile</MenuItem>
                </Link>
                <MenuItem className="hover:font-bold" onClick={logout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link className="hover:font-bold" to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
