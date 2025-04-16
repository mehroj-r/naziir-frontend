import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "../../../services/student.service";
import { useGroups } from "../../../services/group.service";
import styles from "./StudentDetail.module.scss";

const StudentDetail = () => {
  const { id } = useParams();

  const {
    data: student,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => studentService.getById(id).then((res) => res.data),
    enabled: !!id,
  });

  const { data: groupsData } = useGroups({ params: { page: 1, limit: 100 } });

  const groupMap = useMemo(() => {
    const map = {};
    (groupsData?.data?.data ?? []).forEach((group) => {
      map[group.id] = group.name;
    });
    return map;
  }, [groupsData]);

  if (isLoading) return <div>Loading student...</div>;
  if (isError) return <div>Error loading student data</div>;

  return (
    <div className={styles.studentDetail}>
      <h2>Student Detail</h2>
      <div className={styles.profile}>
        <div className={styles.image}>
          <img
            src={student?.profileImage}
            alt={`${student.firstName} ${student.lastName}`}
          />
        </div>
        <div className={styles.info}>
          <p>
            <strong>First Name:</strong> {student.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {student.lastName}
          </p>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {student.phoneNumber}
          </p>
          <p>
            <strong>Student ID:</strong> {student.studentId}
          </p>
          {student.group ? (
            <p>
              <p>
                <strong>Group Name:</strong>
                {groupMap[student.group.id] ?? "Unknown Group"}
              </p>
              <p>
                <strong>Description: </strong>
                {student.group.description}
              </p>
            </p>
          ) : (
            <p>No groups assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
