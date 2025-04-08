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
        <div className={styles.headerRow}>
          <h1>Students</h1>
          <button
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            + Add student
          </button>
        </div>
      </div>

      <div className={styles.searchWrapper}>
        <div className={styles.Searchbar}>
          <button>
            <SearchIcon />
          </button>
          <input type="text" placeholder="Search students" />
        </div>
      </div>

      <CTable columns={COLUMNS} data={data?.data?.data} loading={isLoading} />

      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Student"
        body={
          <NewStudentForm
            onClose={() => {
              setIsModalOpen(false);
            }}
          />
        }
      />
    </div>
  );
};

const NewStudentForm = ({ onClose }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [group, setGroup] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);

    setTimeout(() => {
      onClose();
      alert("New student added successfully!");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          placeholder="Group"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        />
      </div>
      <div className={styles.modalFooter}>
        <button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Student"}
        </button>
      </div>
    </div>
  );
};

export default Students;
