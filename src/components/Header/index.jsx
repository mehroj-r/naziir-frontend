import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import newuuLogo from "../../assets/images/newuuLogo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  AvatarIcon,
  Box,
  Button,
  Container,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import { userActions } from "@/store/slices/userSlice";

export default function Header() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logout = () => {
    if(!window.confirm("You want to log out?")){
      return;
    }
    dispatch(userActions.logout());
    customToast("success", "You have logged out successfully");
  };

  return (
    <Box color='black' w='100vw' bg='white'>
      <Container px='5%'>
        <Flex justifyContent='space-between'>
          <Flex alignItems='center' gap={6}>
            <Image objectFit='contain' h='50px' src={logo} alt="Naziir-logo" />
            <Image objectFit='contain' h='60px' src={newuuLogo} alt="NewUU-logo" />
          </Flex>
          <Flex alignItems='center' gap={4}>
            <Text fontSize='18px'>{userData?.data?.firstName} {userData?.data?.lastName}</Text>
            <Box onClick={logout} border='1px solid black' p={2} rounded='50%' >
              <AvatarIcon />
            </Box>
            {/* <MenuRoot>
              <MenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {userData?.image ? (
                    <Image
                      w='40px'
                      src={userData?.image}
                      alt="profile image"
                    />
                  ) : (
                    <AvatarIcon />
                  )}
                </Button>
              </MenuTrigger>

              <MenuContent>
                <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
                <MenuItem onClick={logout}>Sign Out</MenuItem>
              </MenuContent>
            </MenuRoot> */}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
