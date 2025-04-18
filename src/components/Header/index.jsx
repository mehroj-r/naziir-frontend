import logo from "../../assets/images/logo.png";
import newuuLogo from "../../assets/images/newuuLogo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { userActions } from "@/store/slices/userSlice";
import { customToast } from "@/utils/toastify";
import { authService } from "@/services/auth.service";
import { useState } from "react";
import ConfirmModal from "@/components/CModal/ConfirmModal";

export default function Header() {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setOpenMenu((old) => !old);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action?.onClick();
  };

  const logout = () => {
    setIsLoggingOut(true);
    authService
      .logout()
      .then(() => {
        customToast("success", "You have logged out successfully");
      })
      .catch((err) => {
        console.log("logout err:", err);
      })
      .finally(() => {
        dispatch(userActions.logout());
        setIsLoggingOut(false);
        setConfirmLogout(false);
      });
  };

  const actions = [
    {
      title: "Profile",
      onClick: () => {},
    },
    {
      title: "Log out",
      onClick: () => setConfirmLogout(true),
    },
  ];

  return (
    <>
      <Box color="black" w="100vw" bg="white">
        <Flex px="5%" justifyContent="space-between">
          <Flex alignItems="center" gap={6}>
            <Image objectFit="contain" h="50px" src={logo} alt="Naziir-logo" />
            <Image
              objectFit="contain"
              h="60px"
              src={newuuLogo}
              alt="NewUU-logo"
            />
          </Flex>
          <Flex alignItems="center" gap={4}>
            <Text fontSize="18px">
              {userData?.data?.firstName} {userData?.data?.lastName}
            </Text>
            <Menu>
              <MenuButton
                border="2px solid #081545"
                rounded="50%"
                h="50px"
                w="50px"
                onClick={handleMenuClick}
                cursor="pointer"
                fontSize={12}
              >
                photo
              </MenuButton>
              <MenuList _open={openMenu}>
                {actions?.map((action, index) => (
                  <MenuItem
                    key={index}
                    onClick={(e) => handleActionClick(e, action)}
                    icon={action?.icon}
                  >
                    {action?.title}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>

      <ConfirmModal
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={logout}
        isLoading={isLoggingOut}
      />
    </>
  );
}
