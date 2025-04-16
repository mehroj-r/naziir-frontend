import React, { useMemo, useState } from "react";
import styles from "./Departments.module.scss";
import {
  useDepartments,
  departmentService,
} from "@/services/department.service";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import { customToast } from "../../../utils/toastify";
import SearchBar from "@/components/SearchBar/index";
import ActionMenu from "@/components/ActionMenu";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ConfirmModal from "@/components/CModal/ConfirmModal";

const Departments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [idForDelete, setIdForDelete] = useState("");
  const [departments, setDepartments] = useState([]);

  const { data, isLoading, refetch } = useDepartments({
    params: { page: 1, limit: 50 },
  });

  useMemo(() => {
    if (data?.data?.data) {
      setDepartments(data?.data?.data);
    }
  }, [data]);

  const onModalClose = () => {
    setIsEditing(false);
    setCurrentDepartment(null);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!idForDelete) return;
    setIsDeleting(true);
    departmentService
      ?.delete?.(idForDelete)
      ?.then?.(() => {
        setDepartments((prev) =>
          prev?.filter?.((item) => item?.id !== idForDelete)
        );
        customToast?.("success", "Department deleted");
      })
      ?.catch?.((err) => {
        console.log("err", err);
        customToast?.("error", "Failed to delete department");
      })
      ?.finally?.(() => {
        setIdForDelete("");
        setIsDeleting(false);
      });
  };

  const columns = [
    {
      title: "Department",
      key: "name",
      render: (record) => record?.name ?? "-",
    },
    {
      title: "Professor",
      key: "professor",
      render: (record) => record?.professorCount ?? "-",
    },
    {
      title: "Students",
      key: "students",
      render: (record) => record?.studentCount ?? "-",
    },
    {
      title: "Year",
      key: "year",
      render: (record) => (record?.year ? `Class of ${record?.year}` : "-"),
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
                setIsEditing(true);
                setCurrentDepartment(record);
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
    <div className={styles?.container}>
      <div className={styles?.header}>
        <h1>Departments</h1>
        <button
          className={styles?.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + New Department
        </button>
      </div>
      <SearchBar placeholder="Search for Departments" />
      <CTable columns={columns} data={departments} loading={isLoading} />
      <CModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        title={isEditing ? "Edit Department" : "New Department"}
        body={
          <NewDepartmentForm
            onClose={onModalClose}
            department={currentDepartment}
            isEditing={isEditing}
            onUpdate={(updated) =>
              setDepartments((prev) =>
                prev?.map?.((d) =>
                  d?.id === updated?.id ? { ...d, ...updated } : d
                )
              )
            }
            onCreate={(created) => setDepartments((prev) => [...prev, created])}
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

const NewDepartmentForm = ({
  onClose,
  department,
  isEditing,
  onUpdate,
  onCreate,
}) => {
  const [departmentName, setDepartmentName] = useState(department?.name ?? "");
  const [description, setDescription] = useState(department?.description ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);

    let body = {
      name: departmentName,
      description: description,
    };

    if (isEditing && departmentName === department?.name) {
      delete body?.name;
    }

    const action = isEditing
      ? departmentService?.update?.(department?.id, body)
      : departmentService?.create?.(body);

    action
      ?.then?.((res) => {
        customToast?.(
          "success",
          isEditing
            ? "Department updated successfully"
            : "Department created successfully"
        );
        isEditing ? onUpdate?.(res?.data) : onCreate?.(res?.data);
        onClose?.();
      })
      ?.catch?.((err) => {
        const msg = err?.response?.data?.message ?? "Something went wrong";
        customToast?.("error", msg);
      })
      ?.finally?.(() => setIsLoading(false));
  };

  return (
    <div className={styles?.form}>
      <input
        placeholder="Department name"
        value={departmentName}
        onChange={(e) => setDepartmentName(e?.target?.value)}
      />
      <textarea
        placeholder="Department description"
        value={description}
        onChange={(e) => setDescription(e?.target?.value)}
      />
      <button onClick={onSubmit} disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : isEditing
          ? "Update Department"
          : "Create Department"}
      </button>
    </div>
  );
};

export default Departments;
