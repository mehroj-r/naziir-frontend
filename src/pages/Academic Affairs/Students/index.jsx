import React, { useState } from "react";
import styles from "./Students.module.scss";
import { useStudents } from "@/services/student.service";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import { Button } from "@chakra-ui/react";
import imgprofile from "../../../assets/images/sultan.png";
import { SearchIcon } from "../../../assets/icons/headerIcons";
import SearchBar from "@/components/SearchBar/index";

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
    title: "Email",
    key: "email",
    render: (record) => record?.email,
  },
  {
    title: "Group",
    key: "group",
    render: (record) => record?.group || "N/A",
  },
  {
    title: "Phone",
    key: "phone",
    render: (record) => record?.phone,
  },
  {
    title: "Student ID",
    key: "studentId",
    render: (record) => record?.studentId,
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

      <SearchBar placeholder="Search for Students" />

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
  const [email, setEmail] = useState("");
  const [group, setGroup] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generatePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8); // generates a random 8-character password
    setPassword(randomPassword);
  };

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
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          placeholder="Group (Optional)"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          placeholder="Address (Optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={generatePassword}>
          Generate Password
        </button>
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
