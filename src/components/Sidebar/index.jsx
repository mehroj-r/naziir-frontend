import styles from "./Sidebar.module.scss";
import logo from "../../assets/images/whiteLogo.png";
import newuuLogo from "../../assets/images/newuuLogo.png";
import {
  CourseIcon,
  CreateQuizIcon,
  HomeIcon,
  QuizzesIcon,
  StatisticsIcon,
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
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.sidebar}>
      <div className={styles.logos}>
        <img src={logo} alt="Naziir-logo" className={styles.naziirLogo} />
        <img src={newuuLogo} alt="NewUU-logo" className={styles.newuuLogo} />
      </div>
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
