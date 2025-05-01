import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CourseDetail.module.scss";
import { courseService } from "../../../services/course.service";
import { professorService } from "../../../services/professors.service";
import { groupService } from "../../../services/group.service";

const CourseIdPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [newGroupId, setNewGroupId] = useState("");
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await courseService.getById(courseId);
        const courseData = response.data;
        setCourse(courseData);

        if (
          Array.isArray(courseData.assignedGroupIds) &&
          courseData.assignedGroupIds.length > 0
        ) {
          const groupDetails = await Promise.all(
            courseData.assignedGroupIds.map((groupId) =>
              groupService.getById(groupId).then((res) => res.data)
            )
          );
          setGroups(groupDetails);
        } else {
          setGroups([]);
        }

        // const professorDetails = await Promise.all(
        //   (courseData.professors || []).filter(Boolean).map((item) => {
        //     const id = typeof item === "string" ? item : item.id;
        //     return professorService.getById(id).then((res) => res.data);
        //   })
        // );
        setProfessors(courseData?.professors);

        const allGroupsResponse = await groupService.getAll();
        const allGroups =
          allGroupsResponse?.data?.data ?? allGroupsResponse?.data ?? [];
        setGroupList(Array.isArray(allGroups) ? allGroups : []);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleAssignGroup = async () => {
    if (!newGroupId) return;
    try {
      await courseService.assignGroup(courseId, newGroupId);
      const groupResponse = await groupService.getById(newGroupId);
      setGroups((prevGroups) => [...prevGroups, groupResponse.data]);
      setNewGroupId("");
    } catch (error) {
      console.error("Error assigning group:", error);
    }
  };

  const handleRemoveProfessor = async (professorId) => {
    console.log("Removing professor with ID:", professorId);
    if (!window.confirm("Are you sure you want to remove this professor?"))
      return;
    try {
      await courseService.removeProfessor(courseId, professorId);
      setProfessors((prevProfessors) =>
        prevProfessors.filter((prof) => prof.id !== professorId)
      );
    } catch (error) {
      console.error("Error removing professor:", error.response?.data || error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await courseService.delete(courseId);
      alert("Course deleted");
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div className={styles.coursePage}>
      <div className={styles.header}>
        <h1>{course.courseName}</h1>
        <div className={styles.buttons}>
          <div className={styles.assignGroup}>
            <select
              value={newGroupId}
              onChange={(e) => setNewGroupId(e.target.value)}
            >
              <option value="">Select group</option>
              {groupList.length > 0 ? (
                groupList.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))
              ) : (
                <option disabled>No available groups</option>
              )}
            </select>
            <button onClick={handleAssignGroup}>Assign Group</button>
          </div>
          <button className={styles.delete} onClick={handleDeleteCourse}>
            Delete
          </button>
        </div>
      </div>

      <div className={styles.details}>
        <div>
          <p>
            <strong>Course Code:</strong> {course.courseCode}
          </p>
          <p>
            <strong>Course Name:</strong> {course.courseName}
          </p>
          <p>
            <strong>Course Type:</strong> {course.courseType}
          </p>
          <p>
            <strong>Academic Term:</strong> {course.academicTerm}
          </p>
          <p>
            <strong>Credits:</strong> {course.credits}
          </p>
          <p>
            <strong>Academic Year:</strong> {course.academicYear}
          </p>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className={styles.noGroups}>No groups assigned yet.</p>
      ) : (
        <table className={styles.groupTable}>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Number of Students</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>{group.name}</td>
                <td>{group.studentCount || 0}</td>
                <td>
                  <button onClick={() => navigate(`/groups/${group.id}`)}>
                    See
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.professorList}>
        <h3>Assigned Professors</h3>
        <ul>
          {professors.map((professor) => (
            <li key={professor.professorId}>
              {professor.professorFirstName} {professor.professorLastName}
              <button onClick={() => handleRemoveProfessor(professor.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseIdPage;
