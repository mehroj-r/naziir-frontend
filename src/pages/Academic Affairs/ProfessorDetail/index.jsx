import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { professorService } from "../../../services/professors.service";
import { useDepartments } from "../../../services/department.service";
import { useCourses } from "../../../services/course.service";
import styles from "./ProfessorDetail.module.scss";

const ProfessorDetail = () => {
  const { id } = useParams();

  const {
    data: professor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["professor", id],
    queryFn: () => professorService.getById(id).then((res) => res.data),
    enabled: !!id,
  });

  const { data: departmentsData } = useDepartments({
    params: { page: 1, limit: 100 },
  });
  const { data: coursesData } = useCourses({ params: { page: 1, limit: 100 } });

  const departmentMap = useMemo(() => {
    const map = {};
    (departmentsData?.data?.data ?? []).forEach((dept) => {
      map[dept.id] = dept.name;
    });
    return map;
  }, [departmentsData]);

  const courseMap = useMemo(() => {
    const map = {};
    (coursesData?.data?.data ?? []).forEach((course) => {
      map[course.id] = course.name;
    });
    return map;
  }, [coursesData]);

  if (isLoading) return <div>Loading professor...</div>;
  if (isError) return <div>Error loading professor data</div>;

  return (
    <div className={styles.professorDetail}>
      <h2>Professor Detail</h2>
      <div className={styles.profile}>
        <div className={styles.image}>
          <img
            src="https://via.placeholder.com/150"
            alt={`${professor.firstName} ${professor.lastName}`}
          />
        </div>
        <div className={styles.info}>
          <p>
            <strong>First Name:</strong> {professor.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {professor.lastName}
          </p>
          <p>
            <strong>Email:</strong> {professor.email}
          </p>
          <p>
            <strong>Employee ID:</strong> {professor.employeeId}
          </p>
          <p>
            <strong>Department:</strong>{" "}
            {departmentMap[professor.departmentId] ?? "-"}
          </p>
          <p>
            <strong>Organization:</strong> {professor.organizationId ?? "-"}
          </p>
        </div>
      </div>

      <div className={styles.courses}>
        <h3>Assigned Courses</h3>
        {professor.courses && professor.courses.length > 0 ? (
          <ul>
            {professor.courses.map((course, index) => (
              <li key={index}>
                <p>
                  Course Name:{" "}
                  {courseMap[course.professorId] ?? "Unknown Course"}
                </p>
                <p>Role: {course.assignmentRole}</p>
                <button className={styles.removeButton}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses assigned.</p>
        )}
      </div>
    </div>
  );
};

export default ProfessorDetail;
