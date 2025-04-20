import { Box } from "@chakra-ui/react";
import styles from "./CTable.module.scss";

export default function CTable({
  columns = [],
  data = [],
  loading = false,
  onRowClick = null,
}) {
  if (loading) {
    return <>Loading...</>;
  }

  return (
    <Box height="65vh" overflowY="auto" className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns?.map((col) => (
              <th key={col?.key}>{col?.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr
              key={item?.id}
              onClick={() => onRowClick?.(item)}
              style={{ cursor: onRowClick ? "pointer" : "auto" }}
            >
              {columns?.map((col) => (
                <td key={col?.key}>{col?.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
