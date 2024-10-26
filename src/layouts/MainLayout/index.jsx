// src/layouts/MainLayout/index.jsx
import { Box, Flex } from "@chakra-ui/react";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <Box>
      <Header />
      <Box flex={1} overflowX="hidden">
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
