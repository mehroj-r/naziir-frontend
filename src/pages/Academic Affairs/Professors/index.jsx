import React, { useState, useMemo } from "react";
import styles from "./Professors.module.scss";
import { SearchIcon } from "@/assets/icons/headerIcons";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import { useDepartments } from "@/services/department.service";
import { useProfessors, professorService } from "@/services/professors.service";
import { customToast } from "@/utils/toastify";
import SearchBar from "@/components/SearchBar/index";

const COLUMNS = [
  {
    title: "First Name",
    key: "firstName",
    render: (record) => record?.firstName ?? "-",
  },
  {
    title: "Last Name",
    key: "lastName",
    render: (record) => record?.lastName ?? "-",
  },
  { title: "Email", key: "email", render: (record) => record?.email ?? "-" },
  {
    title: "Employee ID",
    key: "employeeId",
    render: (record) => record?.employeeId ?? "-",
  },
  {
    title: "Department",
    key: "department",
    render: (record) => record?.departmentName ?? "-",
  },
];

const Professors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useProfessors({
    params: { page: 1, limit: 50 },
  });
  const professors = useMemo(() => data?.data?.data ?? [], [data]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Professors</h1>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + New Professor
        </button>
      </div>

      <SearchBar placeholder="Search for Professors" />

      <CTable columns={COLUMNS} data={professors} loading={isLoading} />

      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Professor"
        body={
          <NewProfessorForm
            onClose={() => {
              setIsModalOpen(false);
              refetch();
            }}
          />
        }
      />
    </div>
  );
};

const NewProfessorForm = ({ onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useDepartments({ params: { page: 1, limit: 100 } });
  const departments = useMemo(() => data?.data?.data ?? [], [data]);

  const organizationId = "3f69ffb4-2e25-4041-9520-c61ea6937650";

  const onSubmit = () => {
    if (!firstName || !lastName || !email || !employeeId || !departmentId) {
      customToast("error", "All fields must be filled");
      return;
    }

    setIsLoading(true);
    professorService
      .create({
        firstName,
        lastName,
        email,
        employeeId,
        departmentId,
        organizationId,
      })
      .then(() => {
        customToast("success", "Professor created successfully");
        onClose();
      })
      .catch(() => {
        customToast("error", "Failed to create professor");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.form}>
      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <select
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
      <button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Professor"}
      </button>
    </div>
  );
};

export default Professors;
