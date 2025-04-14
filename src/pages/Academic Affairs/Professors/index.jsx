import React, { useState, useMemo, useEffect } from "react";
import styles from "./Professors.module.scss";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import { useDepartments } from "@/services/department.service";
import { useProfessors, professorService } from "@/services/professors.service";
import { customToast } from "@/utils/toastify";
import SearchBar from "@/components/SearchBar/index";
import { useSelector } from "react-redux";
import ActionMenu from "@/components/ActionMenu";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ConfirmModal from "@/components/CModal/ConfirmModal";

const Professors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProfessor, setEditProfessor] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [idForDelete, setIdForDelete] = useState("");

  const { data, isLoading, refetch } = useProfessors({
    params: { page: 1, limit: 50 },
  });

  const { data: departmentsData } = useDepartments({
    params: { page: 1, limit: 100 },
  });

  const departmentMap = useMemo(() => {
    const map = {};
    (departmentsData?.data?.data ?? []).forEach((dept) => {
      map[dept.id] = dept.name;
    });
    return map;
  }, [departmentsData]);

  const professors = useMemo(() => {
    return (data?.data?.data ?? []).map((prof) => ({
      ...prof,
      departmentName: departmentMap[prof.departmentId] ?? "-",
    }));
  }, [data, departmentMap]);

  const handleDelete = () => {
    if (!idForDelete) return;
    setIsDeleting(true);
    professorService
      .delete(idForDelete)
      .then(() => {
        customToast("success", "Professor deleted successfully");
        refetch();
      })
      .catch(() => {
        customToast("error", "Failed to delete professor");
      })
      .finally(() => {
        setIsDeleting(false);
        setIdForDelete("");
      });
  };

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
    {
      title: "Email",
      key: "email",
      render: (record) => record?.email ?? "-",
    },
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
                setEditProfessor(record);
                setIsModalOpen(true);
              },
            },
            {
              title: "Delete",
              icon: <DeleteIcon />,
              onClick: () => setIdForDelete(record?.id ?? ""),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className={styles?.container}>
      <div className={styles?.header}>
        <h1>Professors</h1>
        <button
          className={styles?.addButton}
          onClick={() => {
            setEditProfessor(null);
            setIsModalOpen(true);
          }}
        >
          + New Professor
        </button>
      </div>

      <SearchBar placeholder="Search for Professors" />

      <CTable columns={COLUMNS} data={professors} loading={isLoading} />

      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editProfessor ? "Edit Professor" : "New Professor"}
        body={
          <NewProfessorForm
            defaultValues={editProfessor}
            onClose={() => {
              setIsModalOpen(false);
              setEditProfessor(null);
              refetch?.();
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

const NewProfessorForm = ({ onClose, defaultValues }) => {
  const [firstName, setFirstName] = useState(defaultValues?.firstName ?? "");
  const [lastName, setLastName] = useState(defaultValues?.lastName ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [employeeId, setEmployeeId] = useState(defaultValues?.employeeId ?? "");
  const [departmentId, setDepartmentId] = useState(
    defaultValues?.departmentId ?? ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useDepartments({ params: { page: 1, limit: 100 } });
  const departments = useMemo(() => data?.data?.data ?? [], [data]);
  const userData = useSelector((state) => state?.user);

  useEffect(() => {
    if (defaultValues) {
      setFirstName(defaultValues.firstName ?? "");
      setLastName(defaultValues.lastName ?? "");
      setEmail(defaultValues.email ?? "");
      setEmployeeId(defaultValues.employeeId ?? "");
      setDepartmentId(defaultValues.departmentId ?? "");
    }
  }, [defaultValues]);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (defaultValues) {
      const body = {
        firstName,
        lastName,
        email,
        employeeId,
        departmentId,
      };

      professorService
        .update(defaultValues?.id, body)
        .then(() => {
          customToast("success", "Professor updated successfully");
          onClose();
        })
        .catch(() => {
          customToast("error", "Failed to update professor");
        })
        .finally(() => setIsLoading(false));
    } else {
      if (!userData?.data?.organization) return;

      const body = {
        firstName,
        lastName,
        email,
        employeeId,
        departmentId,
        organizationId: userData?.data?.organization,
      };

      professorService
        .create(body)
        .then(() => {
          customToast("success", "Professor created successfully");
          onClose();
        })
        .catch(() => {
          customToast("error", "Failed to create professor");
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <form className={styles?.form} onSubmit={onSubmit}>
      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e?.target?.value)}
        required
      />
      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e?.target?.value)}
        required
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e?.target?.value)}
        required
      />
      <input
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e?.target?.value)}
        required
      />
      <select
        value={departmentId}
        onChange={(e) => setDepartmentId(e?.target?.value)}
        required
      >
        <option value="">Select Department</option>
        {departments?.map?.((dept) => (
          <option key={dept?.id} value={dept?.id}>
            {dept?.name}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isLoading}>
        {isLoading
          ? defaultValues
            ? "Updating..."
            : "Creating..."
          : defaultValues
          ? "Update Professor"
          : "Create Professor"}
      </button>
    </form>
  );
};

export default Professors;
