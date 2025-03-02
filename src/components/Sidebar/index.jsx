import {
  CourseIcon,
  CreateQuizIcon,
  HomeIcon,
  QuizzesIcon,
  StatisticsIcon,
  NotificationIcon,
} from "../../assets/icons/sidebarIcons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Flex } from "@chakra-ui/react";
import {
  Courselisticon,
  Departmentlisticon,
  Grouplisticon,
  Professorlisticon,
  StudentlistIcon,
} from "../../assets/icons/aaDashboardIcons";

const items = [
  {
    id: 1,
    title: "Dashboard",
    icon: (color) => <HomeIcon color={color} />,
    navigateTo: "/",
  },
  {
    id: 2,
    title: "My Courses",
    icon: (color) => <CourseIcon color={color} />,
    navigateTo: "/courses",
  },
  {
    id: 3,
    title: "Create Quiz",
    icon: (color) => <CreateQuizIcon color={color} />,
    navigateTo: "/create-quiz",
  },
  {
    id: 4,
    title: "My Quizzes",
    icon: (color) => <QuizzesIcon color={color} />,
    navigateTo: "/quizzes",
  },
  {
    id: 5,
    title: "Statistics",
    icon: (color) => <StatisticsIcon color={color} />,
    navigateTo: "/statistics",
  },
  {
    id: 6,
    title: "Academic Affairs",
    icon: (color) => <HomeIcon color={color} />,
    navigateTo: "/academic-affairs-dashboard",
  },
  {
    id: 7,
    title: "Notifications",
    icon: (color) => <NotificationIcon color={color} />,
    navigateTo: "/notifications",
  },
  {
    id: 8,
    title: "Professors-pages",
    icon: (color) => {console.log(color)},
    navigateTo: "/professors-pages",
  },
];

const managers = [
  {
    title: "Dashboard",
    icon: (color) => <HomeIcon color={color} />,
    navigateTo: "/academic-affairs-dashboard",
  },
  {
    title: "Courses",
    icon: (color) => <CourseIcon color={color} />,
    navigateTo: "/courses-list",
  },
  {
    title: "Professors",
    icon: (color) => <Professorlisticon color={color} />,
    navigateTo: "/professors",
  },
  {
    title: "Students",
    icon: (color) => <StudentlistIcon color={color} />,
    navigateTo: "/students",
  },
  {
    title: "Groups",
    icon: (color) => <Grouplisticon color={color} />,
    navigateTo: "/groups",
  },
  {
    title: "Departments",
    icon: (color) => <Departmentlisticon color={color} />,
    navigateTo: "/departments",
  },
].map(item => ({ ...item, id: item.navigateTo }))

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role } = useSelector((state) => state.user);
  const isActive = (path) => pathname === path

  return (
    <Box bg='#081545' h='full' w='full' p={4} rounded='8px'>
      <Flex flexDirection='column' gap={2} cursor='pointer'>
        {managers.map((item) => (
          <Flex
            key={item.id}
            px={9}
            py={4}
            gap={4}
            h='40px'
            rounded='12px'
            alignItems='center'
            transition='0.3s'
            color={isActive(item.navigateTo) ? 'black' : 'white'}
            bg={isActive(item.navigateTo) ? 'white' : 'transparent'}
            onClick={() => navigate(item.navigateTo)}
            _hover={{ bg: isActive(item.navigateTo) ? 'whiteAlpha.950' : 'whiteAlpha.500' }}
          >
            {item.icon(isActive(item.navigateTo) ? 'black' : 'white')}
            <span>{item.title}</span>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
