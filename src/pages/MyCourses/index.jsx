import React, { useState } from "react";
import styles from "./MyCourses.module.scss";
import CTable from "@/components/CTable";
import { useCourses } from "@/services/course.service";
import CModal from "@/components/CModal";
import { Button } from "@chakra-ui/react";

const COLUMNS = [
  {
    title: "Course",
    key: "course",
    render: (record) => record?.courseName
  },
  {
    title: "Professor",
    key: "professor",
    render: (record) => "???"
  },
  {
    title: "Students",
    key: "professor",
    render: (record) => "???"
  },
  {
    title: "Avg grade",
    key: "professor",
    render: (record) => "???"
  },
  {
    title: "Started",
    key: "professor",
    render: (record) => record?.startYear
  },
  {
    title: "Ended",
    key: "professor",
    render: (record) => "???"
  },
]

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useCourses({
    params: { 
      page: 1, 
      limit: 10,
      academicYear: 2025,
      sortBy: "courseName",
      sortOrder: "ASC"
    },
  });

  return (
    <div className={styles.myCourses}>
     
      <div className={styles.header}>
        <h2 className={styles.title}>Courses</h2>
        <div className={styles.searchWrapper}>
          <input className={styles.searchBar} type="text" placeholder="Search for a course" />
          <button className={styles.addCourseButton} onClick={() => setIsModalOpen(true)}>
            + New Course
          </button>
        </div>
      </div>

      <CTable 
        columns={COLUMNS}
        data={data?.data?.data}
      />

      <CModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Course"
        body={(
          <input />
        )}
      />
    </div>
  );
};

export default Courses;