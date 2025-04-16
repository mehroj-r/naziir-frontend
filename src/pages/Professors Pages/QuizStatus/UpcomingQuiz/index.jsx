import React, { useState, useMemo } from "react";
import styles from "./UpcomingQuiz.module.scss";
import CTable from "@/components/CTable";
import { useQuizzes, quizService } from "@/services/quizService";
import SearchBar from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ActionMenu from "@/components/ActionMenu";
import ConfirmModal from "@/components/CModal/ConfirmModal";
import CModal from "@/components/CModal";
import { Input } from "@chakra-ui/react";
import { customToast } from "@/utils/toastify";

const UpcomingQuizzes = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [idForDelete, setIdForDelete] = useState("");
  const [editQuiz, setEditQuiz] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuizzes({
    params: { quizStatus: "UPCOMING" },
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
      render: (record) => record?.startTime ?? "-",
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Upcoming Quizzes</h1>
      </div>

      <SearchBar placeholder="Search for quizzes" />

      <CTable
        onRowClick={(record) => navigate(`/quizzes/${record?.id ?? ""}`)}
        columns={COLUMNS}
        data={quizzes}
        loading={isLoading}
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
        onConfirm={handleUpdate}
        isLoading={isUpdating}
        title="Edit Quiz Time"
        body={
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
        }
      />
    </div>
  );
};

export default UpcomingQuizzes;
