import React, { useState, useMemo } from "react";
import styles from "./Students.module.scss";
import { useStudents } from "@/services/student.service";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import SearchBar from "@/components/SearchBar/index";
import { useGroups } from "@/services/group.service"; // Import the group service to fetch groups
import { studentService } from "@/services/student.service"; // Import your student service

const COLUMNS = [
  {
    title: "Firstname",
    key: "firstname",
    render: (record) => record?.firstName || "-",
  },
  {
    title: "Lastname",
    key: "lastname",
    render: (record) => record?.lastName || "-",
  },
  {
    title: "Email",
    key: "email",
    render: (record) => record?.email || "-",
  },
  {
    title: "Group",
    key: "group",
    render: (record) => record?.group?.name || "-", // Display group name
  },
  {
    title: "Phone",
    key: "phone",
    render: (record) => record?.phoneNumber || "-",
  },
  {
    title: "Student ID",
    key: "studentId",
    render: (record) => record?.studentId || "-",
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

      {/* Modal to create a new student */}
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
  const [group, setGroup] = useState(""); // State for selected group
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: groupsData } = useGroups({
    params: { page: 1, limit: 50 },
  });

  const groups = useMemo(() => groupsData?.data?.data ?? [], [groupsData]);

  const onSubmit = async () => {
    setIsLoading(true);

    const studentData = {
      firstName: firstname,
      lastName: lastname,
      email,
      phoneNumber: phone,
      studentId,
      groupId: group,
      address,
    };

    console.log("Submitting student data:", studentData);

    try {
      const response = await studentService.create(studentData);

      if (response.status === 201) {
        onClose();
        alert("New student added successfully!");
      } else {
        alert("Error adding student.");
      }
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Failed to add student. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">Select Group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
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
      <div className={styles.modalFooter}>
        <button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Student"}
        </button>
      </div>
    </div>
  );
};

export default Students;
