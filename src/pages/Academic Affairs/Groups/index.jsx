import React, { useState, useMemo, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [idForDelete, setIdForDelete] = useState("");
  const [editGroup, setEditGroup] = useState(null);
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useGroups({
    params: { page: 1, limit: 50 },
  });

  const groups = useMemo(() => data?.data?.data ?? [], [data]);

  const handleDelete = () => {
    if (!idForDelete) return;
    setIsDeleting(true);
    groupService
      .delete(idForDelete)
      .then(() => refetch())
      .catch((err) => console.log("err", err))
      .finally(() => {
        setIdForDelete("");
        setIsDeleting(false);
      });
  };

  const COLUMNS = [
    {
      title: "Group Name",
      key: "name",
      render: (record) => record?.name ?? "-",
    },
    {
      title: "Department",
      key: "department",
      render: (record) => record?.departmentName ?? "-",
    },
    {
      title: "Year",
      key: "year",
      render: (record) => `Class of ${record?.year}` ?? "-",
    },
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
              onClick: () => {
                setEditGroup(record);
                setIsModalOpen(true);
              },
            },
            {
              title: "Delete",
              icon: <DeleteIcon />,
              onClick: () => setIdForDelete(record?.id),
            },
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
          onClick={() => {
            setEditGroup(null);
            setIsModalOpen(true);
          }}
        >
          + New Group
        </button>
      </div>

      <SearchBar placeholder="Search for groups" />
      <CTable onRowClick={(record) => navigate(`/groups/${record?.id}`)} columns={COLUMNS} data={groups} loading={isLoading} />
      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editGroup ? "Edit Group" : "New Group"}
        body={
          <NewGroupForm
            defaultValues={editGroup}
            onClose={() => {
              setIsModalOpen(false);
              setEditGroup(null);
              refetch();
            }}
          />
        }
      />
      <ConfirmModal
        isOpen={Boolean(idForDelete)}
        onClose={() => setIdForDelete("")}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

const NewGroupForm = ({ defaultValues, onClose }) => {
  const [name, setName] = useState(defaultValues?.name || "");
  const [description, setDescription] = useState(
    defaultValues?.description || ""
  );
  const [year, setYear] = useState(defaultValues?.year || "");
  const [departmentId, setDepartmentId] = useState(
    defaultValues?.departmentId || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const userData = useSelector((state) => state.user);
  const { data } = useDepartments({ params: { page: 1, limit: 100 } });
  const departments = useMemo(() => data?.data?.data ?? [], [data]);

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name || "");
      setDescription(defaultValues.description || "");
      setYear(defaultValues.year || "");
      setDepartmentId(defaultValues.departmentId || "");
    }
  }, [defaultValues]);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (defaultValues) {
      const body = {};
      if (name !== defaultValues.name) body.name = name;
      if (description !== defaultValues.description)
        body.description = description;
      if (year !== defaultValues.year) body.year = year;

      groupService
        .update(defaultValues.id, body)
        .then(() => {
          customToast("success", "Group updated successfully");
          onClose();
        })
        .catch((err) => {
          console.log(err?.response?.data || err);
          customToast("error", "Failed to update group");
        })
        .finally(() => setIsLoading(false));
    } else {
      if (!userData?.data?.organization) return;

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
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        placeholder="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Year (e.g., 2025)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <textarea
        placeholder="Group description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {!defaultValues && (
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
      )}
      <button type="submit" disabled={isLoading}>
        {isLoading
          ? defaultValues
            ? "Updating..."
            : "Creating..."
          : defaultValues
          ? "Update"
          : "Create Group"}
      </button>
    </form>
  );
};

export default Groups;
