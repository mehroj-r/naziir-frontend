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
    navigateTo: "/",
  },
  {
    title: "Courses",
    icon: (color) => <CourseIcon color={color} />,
    navigateTo: "/courses",
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

const professors = [
  {
    title: "Dashboard",
    icon: (color) => <HomeIcon color={color} />,
    navigateTo: "/professors/dashboard",
  },
  {
    title: "Courses",
    icon: (color) => <CourseIcon color={color} />,
    navigateTo: "/courses",
  },
  {
    title: "My Quizzes",
    icon: (color) => <StudentlistIcon color={color} />,
    navigateTo: "/quizzes",
  },
  {
    title: "Assistants",
    icon: (color) => <StudentlistIcon color={color} />,
    navigateTo: "/assistants",
  },
].map(item => ({ ...item, id: item.navigateTo }))

const roles = [
  { value: "", label: "Select role" },
  { value: "STUDENT", label: "Student" },
  { value: "ACADEMIC_AFFAIRS", label: "Academic Affairs" },
  { value: "PROFESSOR", label: "Professor" },
  { value: "MANAGER", label: "Manager" },
];

const SIDEBAR_ITEMS = {
  STUDENT: [],
  ACADEMIC_AFFAIRS: managers,
  PROFESSOR: professors,
  MANAGER: managers
}
export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role } = useSelector((state) => state.user);
  const isActive = (path) => pathname === path

  return (
    <Box bg='#081545' h='full' w='full' p={4} rounded='8px'>
      <Flex flexDirection='column' gap={2} cursor='pointer'>
        {SIDEBAR_ITEMS?.[role]?.map((item) => (
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
