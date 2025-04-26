import { Box, Center, Heading, Spinner } from "@chakra-ui/react";
import styles from "./CTable.module.scss";

export default function CTable({
  columns = [],
  data = [],
  loading = false,
  onRowClick = null,
}) {
  if (loading) {
    return (
      <Center height="65vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Center height="65vh" border='1px solid lightgray' rounded={8}>
        <Heading color="gray.500">
          No data to display
        </Heading>
      </Center>
    );
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
