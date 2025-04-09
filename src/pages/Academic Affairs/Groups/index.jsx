import React, { useState, useMemo } from "react";
import styles from "./Groups.module.scss";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import { useDepartments } from "@/services/department.service";
import { useGroups, groupService } from "@/services/group.service";
import { customToast } from "@/utils/toastify";
import SearchBar from "@/components/SearchBar/index";
import { useSelector } from "react-redux";
import ActionMenu from "@/components/ActionMenu";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ConfirmModal from "@/components/CModal/ConfirmModal";

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [idForDelete, setIdForDelete] = useState("");

  const { data, isLoading, refetch } = useGroups({
    params: { page: 1, limit: 50 },
  });
  
  const groups = useMemo(() => data?.data?.data ?? [], [data]);

  const handleDelete = () => {
    if(!idForDelete) return;
    setIsDeleting(true)
    groupService.delete(idForDelete)
      .then(res => {
        refetch()
      })
      .catch(err => {
        console.log("err", err) // log
      })
      .finally(() => {
        setIdForDelete("")
        setIsDeleting(false)
      })
  }

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
    { title: "Year", key: "year", render: (record) => record?.year ?? "-" },
    {
      title: "Students",
      key: "students",
      render: (record) => record?.numOfStudents ?? "-",
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <ActionMenu
          actions={[
            {
              title: "Edit",
              icon: <EditIcon />,
              onClick: () => console.log("actions onclick edit") // log
            },
            {
              title: "Delete",
              icon: <DeleteIcon />,
              onClick: () => setIdForDelete(record?.id)
            }
          ]}
        />
      ),
    },
  ];

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
      <ConfirmModal
        isOpen={Boolean(idForDelete)}
        onClose={() => setIdForDelete("")}
        onConfirm={() => handleDelete()}
        isLoading={isDeleting}
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

  const userData = useSelector((state) => state.user);
  const { data } = useDepartments({ params: { page: 1, limit: 100 } });
  const departments = useMemo(() => data?.data?.data ?? [], [data]);

  const onSubmit = () => {
    if (!userData?.data?.organization) return;
    setIsLoading(true);

    const body = {
      name,
      description,
      year,
      departmentId,
      organizationId: userData?.data?.organization,
    };

    groupService
      .create(body)
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
    <form className={styles.form}>
      <input
        placeholder="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Year (e.g., Class of 2025)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <textarea
        placeholder="Group description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        required
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
    </form>
  );
};

export default Groups;
