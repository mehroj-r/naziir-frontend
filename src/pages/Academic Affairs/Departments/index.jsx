import React, { useMemo, useState } from "react";
import { SearchIcon } from "../../../assets/icons/headerIcons";
import styles from "./Departments.module.scss";
import {
  useDepartments,
  departmentService,
} from "@/services/department.service";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import { customToast } from "../../../utils/toastify";
import SearchBar from "@/components/SearchBar/index";

const COLUMNS = [
  {
    title: "Department",
    key: "name",
    render: (record) => record?.name,
  },
  {
    title: "Professor",
    key: "professor",
    render: (record) => record?.professor ?? "-",
  },
  {
    title: "Students",
    key: "students",
    render: (record) => record?.numOfStudents ?? "-",
  },
  {
    title: "Year",
    key: "year",
    render: (record) => record?.year ? `Class of ${record?.year}` : "-",
  },
  {
    title: "Head of Department",
    key: "head",
    render: (record) => record?.head ?? "-",
  },
  {
    title: "",
    key: "view",
    render: () => <button className={styles.viewButton}>View</button>,
  },
];

const Departments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useDepartments({
    params: { page: 1, limit: 10 },
  });

  const departments = useMemo(() => data?.data?.data ?? [], [data]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Departments</h1>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + New department
        </button>
      </div>
      <SearchBar placeholder="Search for Departments" />
      <CTable columns={COLUMNS} data={departments} loading={isLoading} />
      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Department"
        body={
          <NewDepartmentForm
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

const NewDepartmentForm = ({ onClose }) => {
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);
    departmentService
      .create({
        name: departmentName,
        description: description,
      })
      .then(() => {
        customToast("success", "The department is created successfully");
        onClose();
      })
      .catch(() => {
        customToast("error", "Failed to create department");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.form}>
      <input
        placeholder="Department name"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
      />
      <textarea
        placeholder="Department description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Department"}
      </button>
    </div>
  );
};

export default Departments;
