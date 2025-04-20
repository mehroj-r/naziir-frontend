import React from "react";
import { SearchIcon } from "../../assets/icons/headerIcons";
import styles from "./SearchBar.module.scss";

const SearchBar = ({
  placeholder = "Search for courses, professors and students",
  onChange,
}) => {
  return (
    <div className={styles.searchBar}>
      <SearchIcon />
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
