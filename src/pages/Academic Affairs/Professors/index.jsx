import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Professors.module.scss";
import img1 from "../../../assets/images/sultan.png";
import img2 from "../../../assets/images/profilepicture2.png";
import { SearchIcon } from "../../../assets/icons/headerIcons";
import { useProfessors } from "@/services/professors.service";


const Professors = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useProfessors({
    params: { 
      page: 1, 
      limit: 10, 
      sortBy: 'firstName',
      sortOrder: 'ASC'
    },
  });

  console.log("profs data:", data) // log

  return (
    <div className={styles.pageBody}>
      <h1>Professors</h1>
      <div className={styles.Searchbar}>
      <button>
          <SearchIcon />
        </button>
        <input type="text" placeholder="Search professors" />
      </div>
      <div className={styles.professorList}>
        {data?.data?.data?.map((prof) => (
          <div
            key={prof?.id}
            className={styles.professorItem}
            onClick={() => navigate(`/professors/${prof?.id}`)}
          >
            {prof?.image && (
              <img
                src={prof?.avatar}
                alt={prof?.name}
                className={styles.avatarSmall}
              />
            )}
            <div className={styles.description}>
              <h2>{prof?.firstName} {prof?.lastName}</h2>
              <p>{prof?.employeeId}</p>
              <p>{prof?.email}</p>
            </div>
            <button className={styles.detailsButton}>View Profile</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Professors;
