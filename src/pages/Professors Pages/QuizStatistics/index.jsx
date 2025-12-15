import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  Spinner,
  Flex,
  Progress,
  Badge,
  Button,
  useToast,
} from "@chakra-ui/react";
import { quizService } from "../../../services/quizService";
import styles from "./QuizStatistics.module.scss";

const QuizStatistics = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await quizService.getQuizStatistics(quizId);
        setStatistics(data);
      } catch (error) {
        toast({
          title: "Failed to load statistics",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [quizId, toast]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!statistics || !statistics.participations) {
    return (
      <Box p={6}>
        <Text>No statistics available for this quiz.</Text>
      </Box>
    );
  }

  const getCompletionPercentage = (attempted, total) => {
    if (total === 0) return 0;
    return Math.round((attempted / total) * 100);
  };

  const getStatusBadge = (attempted, total) => {
    const percentage = getCompletionPercentage(attempted, total);
    if (percentage === 100) {
      return <Badge colorScheme="green">Completed</Badge>;
    } else if (percentage > 0) {
      return <Badge colorScheme="yellow">In Progress</Badge>;
    } else {
      return <Badge colorScheme="gray">Not Started</Badge>;
    }
  };

  return (
    <Box className={styles.statisticsPage}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Quiz Attempts Statistics</Heading>
        <Button onClick={() => navigate(`/quizzes/${quizId}`)} colorScheme="blue">
          Back to Quiz
        </Button>
      </Flex>

      <Box className={styles.statsOverview} mb={6}>
        <Box className={styles.statCard}>
          <Text className={styles.statLabel}>Total Students</Text>
          <Text className={styles.statValue}>{statistics.participations.length}</Text>
        </Box>
        <Box className={styles.statCard}>
          <Text className={styles.statLabel}>Completed</Text>
          <Text className={styles.statValue}>
            {statistics.participations.filter(
              (p) => p.attemptedQuestions === p.totalQuestions
            ).length}
          </Text>
        </Box>
        <Box className={styles.statCard}>
          <Text className={styles.statLabel}>In Progress</Text>
          <Text className={styles.statValue}>
            {statistics.participations.filter(
              (p) => p.attemptedQuestions > 0 && p.attemptedQuestions < p.totalQuestions
            ).length}
          </Text>
        </Box>
        <Box className={styles.statCard}>
          <Text className={styles.statLabel}>Not Started</Text>
          <Text className={styles.statValue}>
            {statistics.participations.filter((p) => p.attemptedQuestions === 0).length}
          </Text>
        </Box>
      </Box>

      <Box className={styles.tableContainer}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Student</Th>
              <Th>Status</Th>
              <Th>Progress</Th>
              <Th isNumeric>Attempted</Th>
              <Th isNumeric>Total Questions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {statistics.participations.map((student) => {
              const percentage = getCompletionPercentage(
                student.attemptedQuestions,
                student.totalQuestions
              );

              return (
                <Tr key={student.studentId}>
                  <Td>
                    <Flex align="center" gap={3}>
                      <Avatar
                        size="sm"
                        name={`${student.firstName} ${student.lastName}`}
                        src={
                          student.profilePictureUrl !== "null/media/16c48418-dfee-4174-85c1-ae9f88f7e6a0"
                            ? student.profilePictureUrl
                            : undefined
                        }
                      />
                      <Box>
                        <Text fontWeight="medium">
                          {student.firstName} {student.lastName}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>
                    {getStatusBadge(student.attemptedQuestions, student.totalQuestions)}
                  </Td>
                  <Td>
                    <Box width="200px">
                      <Flex align="center" gap={2}>
                        <Progress
                          value={percentage}
                          size="sm"
                          colorScheme={
                            percentage === 100
                              ? "green"
                              : percentage > 0
                              ? "yellow"
                              : "gray"
                          }
                          width="100%"
                          borderRadius="md"
                        />
                        <Text fontSize="sm" minW="45px">
                          {percentage}%
                        </Text>
                      </Flex>
                    </Box>
                  </Td>
                  <Td isNumeric>
                    <Text fontWeight="medium">{student.attemptedQuestions}</Text>
                  </Td>
                  <Td isNumeric>
                    <Text>{student.totalQuestions}</Text>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default QuizStatistics;

