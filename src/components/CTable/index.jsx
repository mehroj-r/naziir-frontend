import styles from "./CTable.module.scss";

export default function CTable({ columns = [], data = [] }) {
  return (
    <table className={styles.coursesTable}>
      <thead>
        <tr>
          {columns?.map(col => (
            <th key={col?.key}>{col?.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((item, index) => (
          <tr key={item?.id}>
            {columns?.map(col => (
              <td key={col?.key}>{col?.render(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
