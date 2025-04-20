import { useParams } from "react-router-dom";
import { useDepartmentById } from "../../../services/department.service";
import styles from "./DepartmentDetail.module.scss";

const DepartmentDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useDepartmentById({ id });

  const department = data?.data;

  return (
    <div className={styles.departmentPage}>
      <div className={styles.header}>
        <h1>{department?.name || "Department Details"}</h1>
      </div>

      <div className={styles.details}>
        <p>
          <strong>Department Name:</strong> {department?.name || "-"}
        </p>
        <p>
          <strong>Description:</strong> {department?.description || "-"}
        </p>
      </div>
    </div>
  );
};

export default DepartmentDetail;
