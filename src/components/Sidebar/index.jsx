import styles from "./Sidebar.module.scss";

import {
  CourseIcon,
  CreateQuizIcon,
  HomeIcon,
  QuizzesIcon,
  StatisticsIcon,
  NotificationIcon
} from "../../assets/icons/sidebarIcons";
import { useLocation, useNavigate } from "react-router-dom";

const items = [
  {
    id: 1,
    title: "Dashboard",
    icon: <HomeIcon />,
    navigateTo: "/",
  },
  {
    id: 2,
    title: "My Courses",
    icon: <CourseIcon />,
    navigateTo: "/courses",
  },
  {
    id: 3,
    title: "Create Quiz",
    icon: <CreateQuizIcon />,
    navigateTo: "/create-quiz",
  },
  {
    id: 4,
    title: "My Quizzes",
    icon: <QuizzesIcon />,
    navigateTo: "/quizzes",
  },
  {
    id: 5,
    title: "Statistics",
    icon: <StatisticsIcon />,
    navigateTo: "/statistics",
  },
  {
    id: 6,
    title: "Academic Affairs",
    icon: <HomeIcon />,
    navigateTo: "/academic-affairs-dashboard",
  },
  {
    id: 7,
    title: "Notifications", 
    icon: <NotificationIcon />,
    navigateTo: "/notifications", 
  },
  
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.sidebar}>
      <div className={styles.logos}></div>
      <div className={styles.pages}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`
                ${styles.item} 
                ${location?.pathname == item.navigateTo ? styles.active : ""}
            `}
            onClick={() => navigate(item.navigateTo)}
          >
            {item.icon}
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
