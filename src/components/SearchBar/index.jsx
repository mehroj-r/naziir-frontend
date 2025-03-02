import React from "react";
import { SearchIcon } from "../../assets/icons/headerIcons";
import styles from "./SearchBar.module.scss";

const SearchBar = ({
  placeholder = "Search for courses, professors and students",
}) => {
  return (
    <div className={styles.searchBar}>
      <SearchIcon />
      <input type="text" placeholder={placeholder} className={styles.input} />
    </div>
  );
};

export default SearchBar;
