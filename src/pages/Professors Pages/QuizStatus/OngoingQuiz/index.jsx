import React, { useState, useMemo, useEffect } from "react";
import styles from "./OngoingQuiz.module.scss";
import CTable from "@/components/CTable";
import { useQuizzes, quizService } from "@/services/quizService";
import SearchBar from "@/components/SearchBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ActionMenu from "@/components/ActionMenu";
import ConfirmModal from "@/components/CModal/ConfirmModal";
import CModal from "@/components/CModal";
import { Input, Button, Flex } from "@chakra-ui/react";
import { customToast } from "@/utils/toastify";
import { QUIZ_STATUS_OPTIONS, QUIZ_STATUS_OPTIONS_FOR_STUDENTS } from "@/utils/const/quiz";
import CSelect from "@/components/CSelect";
import { useSelector } from "react-redux";

const OngoingQuizzes = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [idForDelete, setIdForDelete] = useState("");
  const [editQuiz, setEditQuiz] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusOption, setStatusOption] = useState(QUIZ_STATUS_OPTIONS[1]);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "OPEN";
  const userData = useSelector(state => state.user)

  const { data, isLoading, refetch } = useQuizzes({
    params: { 
      status: statusOption?.value, 
      page: 1, 
      limit: 50
    },
    props: {
      enabled: !!statusOption?.value
    }
  });

  const quizzes = useMemo(
    () => (Array.isArray(data?.data) ? data?.data : []),
    [data]
  );

  const handleDelete = () => {
    if (!idForDelete) return;
    setIsDeleting(true);

    quizService
      .delete(idForDelete)
      .then(() => {
        customToast("success", "Quiz deleted successfully");
        refetch();
      })
      .catch((err) => {
        console.log("Delete error:", err?.response?.data ?? err);
        customToast("error", "Failed to delete quiz");
      })
      .finally(() => {
        setIdForDelete("");
        setIsDeleting(false);
      });
  };

  const handleUpdate = () => {
    if (!editQuiz?.id) return;

    setIsUpdating(true);
    quizService
      .update(editQuiz.id, {
        startTime: editQuiz.startTime,
        endTime: editQuiz.endTime,
      })
      .then(() => {
        customToast("success", "Quiz updated successfully");
        refetch();
      })
      .catch((err) => {
        console.error(err);
        customToast("error", "Failed to update quiz");
      })
      .finally(() => {
        setIsUpdating(false);
        setEditQuiz(null);
      });
  };

  const COLUMNS = [
    {
      title: "Quiz Title",
      key: "title",
      render: (record) => record?.title ?? "-",
    },
    {
      title: "Course",
      key: "course",
      render: (record) => record?.courseName ?? "-",
    },
    {
      title: "Start Time",
      key: "startTime",
      render: (record) => `${record?.startTime?.slice(0, 10)},  ${record?.startTime?.slice(11, 16)}` ?? "-", 
    },
    {
      title: "End Time",
      key: "endTime",
      render: (record) => `${record?.endTime?.slice(0, 10)},  ${record?.endTime?.slice(11, 16)}` ?? "-",
    },
    {
      title: "Status",
      key: "status",
      render: (record) => record?.status ?? "-",
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
              onClick: () => setEditQuiz(record),
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

  const modalBody = (
    <>
      <label>Start Time</label>
      <Input
        type="datetime-local"
        value={editQuiz?.startTime?.slice(0, 16) ?? ""}
        onChange={(e) =>
          setEditQuiz((prev) => ({ ...prev, startTime: e.target.value }))
        }
        mb={4}
      />
      <label>End Time</label>
      <Input
        type="datetime-local"
        value={editQuiz?.endTime?.slice(0, 16) ?? ""}
        onChange={(e) =>
          setEditQuiz((prev) => ({ ...prev, endTime: e.target.value }))
        }
      />
    </>
  );

  const modalFooter = (
    <>
      <Button variant="ghost" onClick={() => setEditQuiz(null)}>
        Cancel
      </Button>
      <Button colorScheme="blue" onClick={handleUpdate} isLoading={isUpdating}>
        Save
      </Button>
    </>
  );

  useEffect(() => {
    const optionFromParams = QUIZ_STATUS_OPTIONS.find(item => item?.value === status)
    if(optionFromParams){
      setStatusOption(optionFromParams)
    }
  },[status])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ongoing Quizzes</h1>
      </div>

      <Flex alignItems='center' gap={4}>
        <SearchBar placeholder="Search for quizzes" />
        <CSelect 
          options={userData?.role !== 'STUDENT' ? QUIZ_STATUS_OPTIONS : QUIZ_STATUS_OPTIONS_FOR_STUDENTS}
          value={statusOption}
          onChange={(val) => setStatusOption(val)}
          isClearable={false}
          placeholder="Filter by status"
        />
      </Flex>

      <CTable
        columns={COLUMNS}
        data={quizzes}
        loading={isLoading}
        onRowClick={({ id }) => {
          console.log("Row clicked with ID:", id);
          if (id) {
            navigate(`/quizzes/${id}`);
          }
        }}
      />

      <ConfirmModal
        isOpen={Boolean(idForDelete)}
        onClose={() => setIdForDelete("")}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      <CModal
        isOpen={!!editQuiz}
        onClose={() => setEditQuiz(null)}
        title="Edit Quiz Time"
        body={modalBody}
        footer={modalFooter}
      />
    </div>
  );
};

export default OngoingQuizzes;
