import React, { useState, useMemo } from "react";
import styles from "./Groups.module.scss";
import { SearchIcon } from "@/assets/icons/headerIcons";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import { useDepartments } from "@/services/department.service";
import { useGroups, groupService } from "@/services/group.service";
import { customToast } from "@/utils/toastify";
import SearchBar from "@/components/SearchBar/index";

const COLUMNS = [
  { title: "Group Name", key: "name", render: (record) => record?.name },
  {
    title: "Department",
    key: "department",
    render: (record) => record?.departmentName ?? "-",
  },
  { title: "Year", key: "year", render: (record) => record?.year ?? "-" },
  {
    title: "Students",
    key: "students",
    render: (record) => record?.students ?? "-",
  },
];

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGroups({
    params: { page: 1, limit: 50 },
  });
  const groups = useMemo(() => data?.data?.data ?? [], [data]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Groups</h1>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + New Group
        </button>
      </div>

      <SearchBar placeholder="Search for groups" />

      <CTable columns={COLUMNS} data={groups} loading={isLoading} />

      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Group"
        body={
          <NewGroupForm
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

const NewGroupForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useDepartments({ params: { page: 1, limit: 100 } });
  const departments = useMemo(() => data?.data?.data ?? [], [data]);

  const organizationId = "3f69ffb4-2e25-4041-9520-c61ea6937650";

  const onSubmit = () => {
    setIsLoading(true);

    groupService
      .create({ name, description, year, departmentId, organizationId })
      .then(() => {
        customToast("success", "The group is created successfully");
        onClose();
      })
      .catch(() => {
        customToast("error", "Failed to create group");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.form}>
      <input
        placeholder="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Year (e.g., Class of 2025)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <textarea
        placeholder="Group description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
        {isLoading ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
};

export default Groups;
