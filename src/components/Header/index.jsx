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
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/CModal/ConfirmModal";
import { useStudentById } from "@/services/student.service";
import { getMediaIdFromString } from "@/utils/getMediaIdFromString";
import ImageUpload from "../ImageUpload";
import { ROLES } from "@/utils/const/roles";
import { useProfessorById } from "@/services/professors.service";
import { useUserById } from "@/services/user.service";

export default function Header() {
  const userData = useSelector((state) => state.user);
  // const dispatch = useDispatch();

  // const [openMenu, setOpenMenu] = useState(false);
  // const [confirmLogout, setConfirmLogout] = useState(false);
  // const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [image, setImage] = useState({
    url: '',
    id: ''
  })
  const [name, setName] = useState({
    first: '',
    second: ''
  })

  const { data: studentData } = useStudentById({
    id: userData?.userId,
    props: {
      enabled: !!userData?.userId && userData?.role === ROLES.STUDENT
    }
  })

  const { data: professorData } = useProfessorById({
    id: userData?.userId,
    props: {
      enabled: !!userData?.userId && userData?.role === ROLES.PROFESSOR
    }
  })

  const { data: managerData } = useUserById({
    id: userData?.userId,
    props: {
      enabled: !!userData?.userId && userData?.role === ROLES.MANAGER
    }
  })



  console.log("user data:", professorData) // log

  // const handleMenuClick = (e) => {
  //   e.stopPropagation();
  //   setOpenMenu((old) => !old);
  // };

  // const handleActionClick = (e, action) => {
  //   e.stopPropagation();
  //   action?.onClick();
  // };

  // const logout = () => {
  //   setIsLoggingOut(true);
  //   authService
  //     .logout()
  //     .then(() => {
  //       customToast("success", "You have logged out successfully");
  //     })
  //     .catch((err) => {
  //       console.log("logout err:", err);
  //     })
  //     .finally(() => {
  //       dispatch(userActions.logout());
  //       setIsLoggingOut(false);
  //       setConfirmLogout(false);
  //     });
  // };

  // const actions = [
  //   {
  //     title: "Profile",
  //     onClick: () => {},
  //   },
  //   {
  //     title: "Log out",
  //     onClick: () => setConfirmLogout(true),
  //   },
  // ];

  useEffect(() => {
    const currentUser = userData?.role === ROLES.STUDENT
      ? studentData
      : userData?.role === ROLES.PROFESSOR
        ? professorData
        : userData?.role === ROLES.MANAGER
          ? managerData
          : ''
    
    setName({
      first: currentUser?.data?.firstName,
      second: currentUser?.data?.lastName
    })
    if(currentUser?.data?.profilePictureUrl){
      setImage({
        id: getMediaIdFromString(currentUser.data.profilePictureUrl),
        url: ''
      })
    }
  }, [studentData, professorData, managerData])

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
              {name?.first} {name?.second}
            </Text>
            <Box w='50px' h='50px' border='1px solid' borderColor='blackAlpha.300' rounded='50%' >
              <ImageUpload
                image={image}
                setImage={setImage}
                rounded='50%'
                disabled
              />
            </Box>
            {/* <Menu>
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
            </Menu> */}
          </Flex>
        </Flex>
      </Box>

      {/* <ConfirmModal
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={logout}
        isLoading={isLoggingOut}
      /> */}
    </>
  );
}
