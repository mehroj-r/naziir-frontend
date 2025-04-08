import React, { useState, useMemo } from "react";
import styles from "./Groups.module.scss";
import { useDepartments } from "@/services/department.service";
import { SearchIcon } from "@/assets/icons/headerIcons";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";

const COLUMNS = [
  {
    title: "Group Name",
    key: "name",
    render: (record) => record?.name,
  },
  {
    title: "Department",
    key: "department",
    render: (record) => record?.departmentName ?? "-",
  },
  {
    title: "Year",
    key: "year",
    render: (record) => record?.year ?? "-",
  },
  {
    title: "Students",
    key: "students",
    render: (record) => record?.students ?? "-",
  },
];

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useDepartments({
    params: { page: 1, limit: 10 },
  });

  const groups = useMemo(() => {
    return [
      {
        name: "Group A",
        departmentName: "Mathematics",
        year: "2023",
        students: 30,
      },
      {
        name: "Group B",
        departmentName: "Physics",
        year: "2024",
        students: 25,
      },
    ];
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Groups</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.addButton}
        >
          + New Group
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <div className={styles.Searchbar}>
          <button>
            <SearchIcon />
          </button>
          <input type="text" placeholder="Search groups" />
        </div>
      </div>

      <CTable columns={COLUMNS} data={groups} loading={isLoading} />

      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Group"
        body={<NewGroupForm onClose={() => setIsModalOpen(false)} />}
      />
    </div>
  );
};

const NewGroupForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const { data } = useDepartments({ params: { page: 1, limit: 100 } });
  const departments = useMemo(() => data?.data?.data ?? [], [data]);

  const handleSubmit = () => {
    console.log({ name, year, departmentId });
    onClose();
  };

  return (
    <div className={styles.form}>
      <input
        placeholder="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
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
      <button onClick={handleSubmit}>Create Group</button>
    </div>
  );
};

export default Groups;
