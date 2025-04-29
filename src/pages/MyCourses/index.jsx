import React, { useState } from "react";
import styles from "./MyCourses.module.scss";
import CTable from "@/components/CTable";
import { useCourses, courseService } from "@/services/course.service";
import CModal from "@/components/CModal";
import { Button, Input, Select, Textarea } from "@chakra-ui/react";
import { customToast } from "../../utils/toastify";
import SearchBar from "@/components/SearchBar/index";
import { useProfessors } from "@/services/professors.service";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ActionMenu from "@/components/ActionMenu";
import ConfirmModal from "@/components/CModal/ConfirmModal";
import { ROLES } from "@/utils/const/roles";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const Courses = () => {
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [idForDelete, setIdForDelete] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedProfessorId, setSelectedProfessorId] = useState("");
  const [assignmentRole, setAssignmentRole] = useState("LEAD");

  const [editCourseId, setEditCourseId] = useState(null);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [academicTerm, setAcademicTerm] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState("");
  const [courseType, setCourseType] = useState("");
  const [academicYear, setAcademicYear] = useState(currentYear.toString());
  const [organizationId] = useState("3f69ffb4-2e25-4041-9520-c61ea6937650");
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useCourses({
    params: { page: 1, limit: 10, academicYear, searchTerm },
  });

  const handleSearch = (val) => {
    setSearchTerm(val);
    refetch();
  };

  const { data: professorsData } = useProfessors({
    params: {},
    props: {
      enabled: role === ROLES.MANAGER,
    },
  });

  const openEditModal = (course) => {
    setEditCourseId(course.id);
    setCourseCode(course.courseCode);
    setCourseName(course.courseName);
    setAcademicTerm(course.academicTerm);
    setDescription(course.description);
    setCredits(course.credits);
    setCourseType(course.courseType);
    setAcademicYear(course.academicYear);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (courseId) => {
    setIdForDelete(courseId);
  };

  const baseColumns = [
    {
      title: "Code",
      key: "Code",
      render: (record) => record?.courseCode ?? "-",
    },
    {
      title: "Course",
      key: "course",
      render: (record) => record?.courseName ?? "-",
    },
    {
      title: "Professor",
      key: "professor",
      render: (record) => {
        if (!record?.professors || !Array.isArray(record.professors))
          return "-";

        return record.professors
          .map((professor) => {
            return `${professor.professorFirstName} ${professor.professorLastName} (${professor.assignmentRole})`;
          })
          .join(", ");
      },
    },
    {
      title: "Term",
      key: "Term",
      render: (record) => record?.academicTerm ?? "-",
    },
  ];

  const actionColumn = {
    key: "actions",
    render: (record) => (
      <ActionMenu
        actions={[
          {
            title: "Edit",
            icon: <EditIcon />,
            onClick: () => openEditModal(record),
          },
          {
            title: "Delete",
            icon: <DeleteIcon />,
            onClick: () => openDeleteModal(record.id),
          },
        ]}
      />
    ),
  };

  const COLUMNS =
    role === ROLES.PROFESSOR || ROLES.STUDENT
      ? baseColumns
      : [...baseColumns, actionColumn];

  const isFormValid = () => {
    return (
      courseCode &&
      courseName &&
      academicTerm &&
      description &&
      credits &&
      courseType &&
      academicYear &&
      !isNaN(credits) &&
      !isNaN(academicYear)
    );
  };

  const onSubmit = async () => {
    try {
      const courseData = {
        courseCode,
        courseName,
        academicTerm,
        description,
        credits,
        courseType,
        academicYear,
        organizationId,
      };

      await courseService.create(courseData);
      customToast("success", "Course created successfully!");
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      customToast("error", "Failed to create the course!");
    }
  };

  const onUpdateCourse = async () => {
    if (!editCourseId) return;

    try {
      const updatedCourse = {
        courseCode,
        courseName,
        academicTerm,
        description,
        credits,
        courseType,
        academicYear,
      };

      await courseService.update(editCourseId, updatedCourse);
      customToast("success", "Course updated successfully!");
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      customToast("error", "Failed to update course!");
    }
  };

  const handleDelete = async () => {
    if (!idForDelete) return;

    setIsDeleting(true);
    try {
      await courseService.delete(idForDelete);
      customToast("success", "Course deleted successfully!");
      setIdForDelete("");
      refetch();
    } catch (error) {
      customToast("error", "Failed to delete course!");
      setIsDeleting(false);
    }
  };

  const onAssignProfessor = async () => {
    if (!selectedCourseId || !selectedProfessorId) {
      customToast("error", "Select a course and professor!");
      return;
    }

    try {
      const payload = {
        assignments: [
          {
            professorId: selectedProfessorId,
            assignmentRole,
          },
        ],
      };

      await courseService.assignProfessor(selectedCourseId, payload);
      customToast("success", "Professor assigned successfully!");
      setIsAssignModalOpen(false);
      refetch();
    } catch (error) {
      customToast("error", "Failed to assign professor!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Courses</h2>
        <div className={styles.actions}>
          {(role === ROLES.ACADEMIC_AFFAIRS || role === ROLES.MANAGER) && (
            <>
              <button
                className={styles.addCourseButton}
                onClick={() => setIsModalOpen(true)}
              >
                + New Course
              </button>
              <button
                className={styles.addCourseButton}
                onClick={() => setIsAssignModalOpen(true)}
              >
                + Assign Professor
              </button>
            </>
          )}
        </div>
      </div>

      <SearchBar placeholder="Search for Courses" onChange={handleSearch} />

      <CTable
        columns={COLUMNS}
        data={data?.data?.data}
        loading={isLoading}
        onRowClick={(record) => {
          if (!record?.id) return;

          if (role === ROLES.PROFESSOR) {
            navigate(`/professor/courses/${record.id}`);
          } else {
            navigate(`/courses/${record.id}`);
          }
        }}
      />

      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Course"
        body={
          <div className={styles.form}>
            <Input
              type="text"
              placeholder="Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Academic Term (e.g., FALL)"
              value={academicTerm}
              onChange={(e) => setAcademicTerm(e.target.value)}
            />
            <Textarea
              placeholder="Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Course Type (e.g., LECTURE)"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Academic Year (e.g., 2025)"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
            <Button
              className={styles.myButton}
              onClick={onSubmit}
              disabled={!isFormValid()}
            >
              Create Course
            </Button>
          </div>
        }
      />

      <CModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Professor to Course"
        body={
          <div className={styles.form}>
            <Select
              placeholder="Select Course"
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {data?.data?.data?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select Professor"
              onChange={(e) => setSelectedProfessorId(e.target.value)}
            >
              {Array.isArray(professorsData?.data?.data) &&
                professorsData.data.data.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.firstName} {prof.lastName}
                  </option>
                ))}
            </Select>

            <Select
              placeholder="Select Role"
              value={assignmentRole}
              onChange={(e) => setAssignmentRole(e.target.value)}
            >
              <option value="LEAD">LEAD</option>
              <option value="ASSISTANT">ASSISTANT</option>
            </Select>

            <Button onClick={onAssignProfessor}>Assign Professor</Button>
          </div>
        }
      />

      <CModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Course"
        body={
          <div className={styles.form}>
            <Input
              type="text"
              placeholder="Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Academic Term"
              value={academicTerm}
              onChange={(e) => setAcademicTerm(e.target.value)}
            />
            <Textarea
              placeholder="Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Course Type"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
            />
            <Button onClick={onUpdateCourse}>Update Course</Button>
          </div>
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

export default Courses;

