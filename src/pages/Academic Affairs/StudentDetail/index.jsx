import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "../../../services/student.service";
import { useGroups } from "../../../services/group.service";
import styles from "./StudentDetail.module.scss";
import ImageUpload from "@/components/ImageUpload";
import { Box } from "@chakra-ui/react";
import { getMediaIdFromString } from "@/utils/getMediaIdFromString";

const StudentDetail = () => {
  const { id } = useParams();
  const [image, setImage] = useState({
    url: '',
    id: ''
  })

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

  useEffect(() => {
    if(student?.profilePictureUrl){
      setImage({
        id: getMediaIdFromString(student.profilePictureUrl),
        url: ''
      })
    }
  }, [student])

  if (isLoading) return <div>Loading student...</div>;
  if (isError) return <div>Error loading student data</div>;

  return (
    <div className={styles.studentDetail}>
      <h2>Student Detail</h2>
      <div className={styles.profile}>
        <Box w='150px' h='150px' border='1px solid gray' >
          <ImageUpload
            image={image}
            setImage={setImage}
          
            disabled
          />
        </Box>
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
