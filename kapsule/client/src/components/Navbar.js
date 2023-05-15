import { Link, useNavigate } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import { useLogout } from "../hooks/useLogout";

import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  Collapse,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

import MenuIcon from "@mui/icons-material/Menu";

import { Close, LightMode, DarkMode, Person } from "@mui/icons-material";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();
  const { logout } = useLogout();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  return (
    <Box position={"absolute"} w={"100%"}>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <Close /> : <MenuIcon />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({
              base: "center",
              md: "left",
            })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            fontWeight={800}
            href="#home"
            _hover={{
              textDecoration: "none",
            }}
          >
            <Link to="/">Home</Link>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />

            <Box
              marginLeft={8}
              justify="flex-end"
              onClick={toggleColorMode}
              color={useColorModeValue("gray.600", "gray.200")}
              _hover={{
                textDecoration: "none",
                color: useColorModeValue("gray.800", "white"),
                cursor: "pointer",
              }}
            >
              {colorMode === "light" ? <DarkMode /> : <LightMode />}
            </Box>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {!user && (
            <Stack direction={"row"}>
              <Button
                as={"a"}
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
                href={"#"}
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                as={"a"}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"purple.400"}
                href={"#"}
                _hover={{
                  bg: "purple.300",
                }}
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </Stack>
          )}
          {user && (
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Stack direction={"row"} align={"center"} spacing={2}>
                  <Avatar size={"sm"} src={Person} bg={"gray.300"} />
                  <Text>{user.username}</Text>
                </Stack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogOut}>Log out</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

export default Navbar;

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  return (
    <Stack direction={"row"} spacing={6} alignItems={"center"}>
      {NAV_ITEMS.map((navItem) => (
        <Box
          key={navItem.label}
          color={linkColor}
          fontSize={"sm"}
          fontWeight={500}
          _hover={{
            cursor: "pointer",
            color: linkHoverColor,
          }}
        >
          <Link to={navItem.link}>{navItem.label}</Link>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <Box
          key={navItem.label}
          fontSize={"sm"}
          fontWeight={600}
          color={linkColor}
          _hover={{
            textDecoration: "none",
            cursor: "pointer",
            color: linkHoverColor,
          }}
        >
          <Link to={navItem.link}>{navItem.label}</Link>
        </Box>
      ))}
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Popular",
    link: "/popular",
  },
  {
    label: "Discover",
    link: "/discover",
  },
  {
    label: "Search",
    link: "/search",
  },
];
