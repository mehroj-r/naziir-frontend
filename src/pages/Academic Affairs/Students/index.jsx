import React, { useState } from "react";
import styles from "./Students.module.scss";
import { useStudents } from "@/services/student.service";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import { Button } from "@chakra-ui/react";
import imgprofile from "../../../assets/images/sultan.png";
import { SearchIcon } from "../../../assets/icons/headerIcons";

const COLUMNS = [
  {
    title: "Firstname",
    key: "firstname",
    render: (record) => record?.firstname,
  },
  {
    title: "Lastname",
    key: "lastname",
    render: (record) => record?.lastname,
  },
  {
    title: "Group",
    key: "group",
    render: (record) => "???",
  },
  {
    title: "Avg Grade",
    key: "grade",
    render: (record) => "???",
  },
];

const Students = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useStudents({
    params: {
      page: 1,
      limit: 10,
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Students</h1>
        <p>Manage and view student profiles</p>
        <div className={styles.searchWrapper}>
          <div className={styles.Searchbar}>
            <button>
              <SearchIcon />
            </button>
            <input type="text" placeholder="Search students" />
          </div>
          <button
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            + Add student
          </button>
        </div>
      </div>

      <CTable columns={COLUMNS} data={data?.data?.data} loading={isLoading} />

      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Student"
        body={
          <div>
            <input placeholder="Student name" />
            <input placeholder="Group" />
            <input placeholder="Grade" />
          </div>
        }
      />
    </div>
  );
};

export default Students;
