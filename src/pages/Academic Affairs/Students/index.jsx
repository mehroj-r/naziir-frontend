import React, { useState, useMemo, useEffect, useCallback } from "react";
import styles from "./Students.module.scss";
import { useStudents, studentService } from "@/services/student.service";
import { useGroups } from "@/services/group.service";
import CTable from "@/components/CTable";
import CModal from "@/components/CModal";
import ConfirmModal from "@/components/CModal/ConfirmModal";
import SearchBar from "@/components/SearchBar/index";
import { customToast } from "@/utils/toastify";
import ActionMenu from "@/components/ActionMenu";
import { Box, DeleteIcon, EditIcon, Flex } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import CSelect from "@/components/CSelect";
import ImageUpload from "@/components/ImageUpload";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Students = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [idForDelete, setIdForDelete] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const params = useMemo(
    () => ({
      page: 1,
      limit: 10,
      searchTerm,
    }),
    [searchTerm]
  );

  const { data, isLoading, refetch } = useStudents({ params });

  const students = useMemo(() => data?.data?.data ?? [], [data]);

  const handleDelete = () => {
    if (!idForDelete) return;
    setIsDeleting(true);
    studentService
      .delete(idForDelete)
      .then(() => {
        customToast("success", "Student deleted successfully");
        refetch();
      })
      .catch(() => {
        customToast("error", "Failed to delete student");
      })
      .finally(() => {
        setIdForDelete("");
        setIsDeleting(false);
      });
  };

  const handleSearch = useCallback(
    debounce((val) => {
      setSearchTerm(val);
      refetch();
    }, 300),
    [refetch]
  );

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
      render: (record) => record?.group?.name || "-",
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
                setEditStudent(record);
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
        <div className={styles?.headerRow}>
          <h1>Students</h1>
          <button
            className={styles?.addButton}
            onClick={() => {
              setEditStudent(null);
              setIsModalOpen(true);
            }}
          >
            + Add student
          </button>
        </div>
      </div>

      <SearchBar placeholder="Search for Students" onChange={handleSearch} />

      <CTable
        columns={COLUMNS}
        data={students}
        loading={isLoading}
        onRowClick={(record) => navigate(`/students/${record.id ?? ""}`)}
      />

      <CModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditStudent(null);
        }}
        title={editStudent ? "Edit Student" : "New Student"}
        body={
          <NewStudentForm
            defaultValues={editStudent}
            onClose={() => {
              setIsModalOpen(false);
              setEditStudent(null);
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

const NewStudentForm = ({ defaultValues, onClose }) => {
  const [firstName, setFirstName] = useState(defaultValues?.firstName ?? "");
  const [lastName, setLastName] = useState(defaultValues?.lastName ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    defaultValues?.phoneNumber ?? ""
  );
  const [studentId, setStudentId] = useState(defaultValues?.studentId ?? "");
  const [groupId, setGroupId] = useState(defaultValues?.group?.id ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState({
    url: '',
    id: '',
  })

  const { data } = useGroups({ params: { page: 1, limit: 100 } });
  const groups = useMemo(() => data?.data?.data ?? [], [data]);

  useEffect(() => {
    if (defaultValues) {
      setFirstName(defaultValues.firstName ?? "");
      setLastName(defaultValues.lastName ?? "");
      setEmail(defaultValues.email ?? "");
      setPhoneNumber(defaultValues.phoneNumber ?? "");
      setStudentId(defaultValues.studentId ?? "");
      if(defaultValues?.group?.id && defaultValues?.group?.name){
        setGroupId({
          label: defaultValues?.group?.name,
          value: defaultValues?.group?.id
        });
      }
    }
  }, [defaultValues]);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      firstName,
      lastName,
      email,
      phoneNumber,
      studentId,
      groupId: groupId?.value,
      profilePictureId: image?.id
    };

    const request = defaultValues
      ? studentService.update(defaultValues.id, body)
      : studentService.create(body);

    request
      .then(() => {
        customToast(
          "success",
          defaultValues
            ? "Student updated successfully"
            : "Student created successfully"
        );
        onClose();
      })
      .catch(() => {
        customToast(
          "error",
          defaultValues
            ? "Failed to update student"
            : "Failed to create student"
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Flex alignItems='center' justifyContent='center'>
        <Box
          w='80px'
          h='80px'
          border='1px solid gray'
          rounded='50%'
        >
          <ImageUpload 
            image={image}
            setImage={setImage}
            rounded='50%'
          />
        </Box>
      </Flex>
      <input
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        required
      />
      <CSelect
        placeholder="Group"
        options={groups?.map((group) => ({
          value: group?.id,
          label: group?.name,
        }))}
        onChange={(val) => setGroupId(val)} // { value: '', label: '' }
        value={groupId}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading
          ? defaultValues
            ? "Updating..."
            : "Creating..."
          : defaultValues
          ? "Update"
          : "Create Student"}
      </button>
    </form>
  );
};

export default Students;
