import profileImage from "../../assets/images/profileImage.png";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import newuuLogo from "../../assets/images/newuuLogo.png";
import { Box, Container, Flex, Image, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Header() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  console.log("header userData:", userData) // log
  return (
    <Box w='100vw' bg='white'>
      <Container>
        <Flex justifyContent='space-between'>
          <Flex alignItems='center' gap={6}>
            <Image objectFit='contain' h='50px' src={logo} alt="Naziir-logo" />
            <Image objectFit='contain' h='60px' src={newuuLogo} alt="NewUU-logo" />
          </Flex>
          <Flex>
            <Text>{userData?.data?.firstName} {userData?.data?.lastName}</Text>
            <Link to='/logout'>
              <Image
                src={profileImage}
                alt="profile image"
              />
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
