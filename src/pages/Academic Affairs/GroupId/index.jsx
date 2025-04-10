import React, { useEffect, useState } from "react";
import styles from "./GroupDetail.module.scss";
import { useParams, useNavigate } from "react-router-dom";
import { groupService } from "@/services/group.service";
import { customToast } from "@/utils/toastify";

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    groupService
      .getById(id)
      .then((res) => setGroup(res.data))
      .catch(() => {
        customToast("error", "Failed to load group");
        navigate("/groups");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await groupService.delete(id);
      customToast("success", "Group deleted");
      navigate("/groups");
    } catch {
      customToast("error", "Failed to delete group");
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (!group) return <div className={styles.container}>Group not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{group.name}</h1>
        <button className={styles.deleteButton} onClick={handleDelete}>
          Delete
        </button>
      </div>

      <div className={styles.info}>
        <div>
          <span>Department</span>
          <p>{group.departmentName}</p>
        </div>
        <div>
          <span>Year</span>
          <p>{group.year}</p>
        </div>
        <div>
          <span>Status</span>
          <p>{group.active ? "Active" : "Inactive"}</p>
        </div>
      </div>

      <div className={styles.list}>
        <h2>Assigned Students</h2>
        {group.students.length === 0 ? (
          <p className={styles.empty}>No students assigned to this group.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Student ID</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {group.students.map((student) => (
                <tr key={student.id}>
                  <td>{student.firstName} </td>
                  <td>{student.lastName}</td>
                  <td>{student.studentId}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
