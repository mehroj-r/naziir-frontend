import { Box, Input, IconButton } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { useState } from "react";

import logoImg from "../../assets/images/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const elements = [
    {
      label: "Statistics",
      link: "/statistics",
    },
    {
      label: "My Courses",
      link: "/courses",
    },
    {
      label: "My Quizzes",
      link: "/quizzes",
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      //display the results
      navigate(`/search?query=${searchQuery}`);
    }
  };
  return (
    <Box className={styles.header}>
      <Link className={styles.logo} to="/">
        <img src={logoImg} alt="naziir logo" />
      </Link>

      <Box as="nav" className={styles.navbar}>
        {elements.map((element, index) => (
          <Box
            key={index}
            onClick={() => navigate(element.link)}
            className={`${styles.element} ${
              pathname === element.link ? styles.active : ""
            }`}
          >
            {element.label}
          </Box>
        ))}
      </Box>

      <Box className={styles.searchContainer}>
        <Input
          className={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          borderColor="#00aaff"
          size="sm"
          borderRadius="6px"
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          <img src="/src/assets/images/search.png"></img>
        </button>
      </Box>
    </Box>
  );
}
