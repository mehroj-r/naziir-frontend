import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { quizService } from "@/services/quizService";
import styles from "./QuizResults.module.scss";
import { Box, Button, Flex, Text, Image, Spinner } from "@chakra-ui/react";

const QuizResult = () => {
  const { quizId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await quizService.getResult(quizId);
        setResultData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [quizId]);

  if (loading || !resultData) {
    return (
      <Box className={styles.loading}>
        <Spinner size="xl" />
      </Box>
    );
  }

  const {
    studentProfilePictureUrl,
    studentFirstName,
    studentId,
    studentLastName,
    studentEmail,
    quizTitle,
    groupName,
    overallCorrectCount,
    overallPercentage,
    totalQuestions,
    attemptedQuestions,
    timeLimit,
    timeSpent,
    questions,
  } = resultData;

  return (
    <Box className={styles.quizResult}>
      <Box className={styles.header}>
        <Text style={{ fontSize: "34px" }} className={styles.title}>
          {quizTitle} – Result
        </Text>
        <Button colorScheme="blue" variant="outline" size="sm">
          Download Result
        </Button>
      </Box>

      <Box className={styles.profileSection}>
        <Flex className={styles.profileInfo}>
          <Image
            src={studentProfilePictureUrl}
            alt="Profile"
            className={styles.profilePic}
          />
          <Box className={styles.profileDetails}>
            <Text style={{ fontSize: "28px" }} className={styles.text}>
              {" "}
              {studentFirstName} {studentLastName}{" "}
            </Text>
            <Text className={styles.text}>
              <strong>Student ID:</strong>
              {studentId}
            </Text>
            <Text className={styles.text}>
              <strong>Semester:</strong>
            </Text>
            <Text className={styles.text}>
              <strong>Group:</strong> {groupName}
            </Text>
            <Text className={styles.text}>
              <strong>Email:</strong> {studentEmail}
            </Text>
          </Box>
        </Flex>
        <Box className={styles.scoreBox}>
          <Text className={styles.scorePercent}>{overallPercentage} %</Text>
          <Text className={styles.scoreFraction}>
            {overallCorrectCount}/{totalQuestions}
          </Text>
        </Box>
      </Box>

      <Flex className={styles.summaryCards}>
        <Box className={styles.card}>
          <Flex className={styles.cardNumbers}>
            <Text className={styles.cardMain}>{totalQuestions}</Text>
            <Text className={styles.cardMain}>{attemptedQuestions}</Text>
          </Flex>
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            <Text className={styles.cardTitle}>Total</Text>
            <Text className={styles.cardTitle}>Attempted</Text>
          </div>
        </Box>
        <Box className={styles.card}>
          <Flex className={styles.cardNumbers}>
            <Text className={styles.cardMain}>{overallCorrectCount}</Text>
            <Text className={styles.cardMain}>
              {totalQuestions - overallCorrectCount}
            </Text>
          </Flex>
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            <Text className={styles.cardTitle}>Correct</Text>
            <Text className={styles.cardTitle}>Wrong</Text>
          </div>
        </Box>
        <Box className={styles.card}>
          <Flex className={styles.cardNumbers}>
            <Text className={styles.cardMain}>{timeLimit}</Text>
            <Text className={styles.cardMain}>{timeSpent}</Text>
          </Flex>
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            <Text className={styles.cardTitle}>Time Limit</Text>
            <Text className={styles.cardTitle}>Time Spent</Text>
          </div>
        </Box>
      </Flex>

      <Box className={styles.questionsSection}>
        {questions.map((q, index) => (
          <Box
            key={index}
            className={`${styles.questionCard} ${
              q.result === "Correct"
                ? styles.correct
                : q.result === "Wrong"
                ? styles.wrong
                : styles.skipped
            }`}
          >
            <Flex justify="space-between" align="center" mb="2">
              <Text className={styles.questionType}>
                {q.questionType.replace("_", " ")}
              </Text>
              <Text className={styles.questionResult}>
                {q.result === "Correct" && "Correct Answer"}
                {q.result === "Wrong" && "Wrong Answer"}
                {q.result === "Skipped" && "Skipped"}
              </Text>
            </Flex>

            <Text className={styles.questionContent}>Question {index + 1}</Text>
            <Text className={styles.questionText}>{q.questionContent}</Text>

            {q.options ? (
              <Box className={styles.options}>
                {q.options.map((opt) => (
                  <Flex
                    key={opt.id}
                    className={`${styles.option} ${
                      opt.isCorrect
                        ? styles.correctOption
                        : opt.isSelected && !opt.isCorrect
                        ? styles.wrongOption
                        : ""
                    }`}
                  >
                    <input type="radio" checked={opt.isSelected} disabled />
                    <Text>{opt.content}</Text>
                  </Flex>
                ))}
              </Box>
            ) : (
              <Text className={styles.shortAnswer}>
                {q.studentAnswer || "No Answer"}
              </Text>
            )}

            <Flex justify="space-between" align="center" mt="4">
              <Text className={styles.point}>
                {q.studentPoints}/{q.questionPoints} Points
              </Text>
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default QuizResult;
