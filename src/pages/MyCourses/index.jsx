import React, { useState } from "react";
import styles from "./MyCourses.module.scss";
import CTable from "@/components/CTable";
import { useCourses } from "@/services/course.service";
import CModal from "@/components/CModal";
import { Button } from "@chakra-ui/react";
import { customToast } from "../../utils/toastify";
import { courseService } from "@/services/course.service";
import { SearchIcon } from "@/assets/icons/headerIcons";
import SearchBar from "@/components/SearchBar/index";

const COLUMNS = [
  {
    title: "Course",
    key: "course",
    render: (record) => record?.courseName,
  },
  {
    title: "Professor",
    key: "professor",
    render: (record) => "???",
  },
  {
    title: "Students",
    key: "students",
    render: (record) => "???",
  },
  {
    title: "Started",
    key: "startYear",
    render: (record) => record?.startYear,
  },
  {
    title: "Ended",
    key: "endYear",
    render: (record) => "???",
  },
];

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [academicTerm, setAcademicTerm] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState("");
  const [courseType, setCourseType] = useState("");
  const [academicYear, setAcademicYear] = useState("2025");
  const [organizationId] = useState("3f69ffb4-2e25-4041-9520-c61ea6937650");
  const { data, isLoading } = useCourses({
    params: { page: 1, limit: 10, academicYear: 2025 },
  });

  const isFormValid = () => {
    return (
      courseCode &&
      courseName &&
      academicTerm &&
      description &&
      credits &&
      courseType &&
      academicYear
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
    } catch (error) {
      customToast("error", "Failed to create the course!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Courses</h2>
        <button
          className={styles.addCourseButton}
          onClick={() => setIsModalOpen(true)}
        >
          + New Course
        </button>
      </div>
      <SearchBar placeholder="Search for Courses" />
      <CTable columns={COLUMNS} data={data?.data?.data} loading={isLoading} />

      <CModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Course"
        body={
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Academic Term (e.g., FALL)"
              value={academicTerm}
              onChange={(e) => setAcademicTerm(e.target.value)}
            />
            <textarea
              placeholder="Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />
            <input
              type="text"
              placeholder="Course Type (e.g., LECTURE)"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
            />
            <input
              type="text"
              placeholder="Academic Year (e.g., 2025)"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
            <Button onClick={onSubmit} disabled={!isFormValid()}>
              Create Course
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default Courses;
