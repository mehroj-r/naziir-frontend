import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { quizService } from "@/services/quizService";
import { mediaService } from "@/services/media.service";
import styles from "./QuizResults.module.scss";
import { Box, Button, Flex, Text, Image, Spinner } from "@chakra-ui/react";
import { getMediaIdFromString } from "@/utils/getMediaIdFromString";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const QuizResult = () => {
  const { quizId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState({ url: "", id: "" });

  const resultRef = useRef(null); // PDF capture ref

  useEffect(() => {
    if (resultData?.studentProfilePictureUrl) {
      const mediaId = getMediaIdFromString(resultData.studentProfilePictureUrl);
      if (mediaId) {
        setImage({ id: mediaId, url: "" });
      }
    }
  }, [resultData]);

  useEffect(() => {
    if (!image?.id || image?.url) return;
    setIsLoading(true);
    mediaService
      .getById(image.id)
      .then((res) => {
        const blob = res.data;
        const url = URL.createObjectURL(blob);
        setImage((prev) => ({ id: prev.id, url }));
      })
      .finally(() => setIsLoading(false));
  }, [image]);

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
    if (quizId) fetchResult();
  }, [quizId]);

  const handleDownloadPdf = () => {
    const input = resultRef.current;
    if (!input) return;

    html2canvas(input, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        const totalPages = Math.ceil(
          pdfHeight / pdf.internal.pageSize.getHeight()
        );
        for (let i = 1; i < totalPages; i++) {
          pdf.addPage();
          pdf.addImage(
            imgData,
            "PNG",
            0,
            -(i * pdf.internal.pageSize.getHeight()),
            pdfWidth,
            pdfHeight
          );
        }
      }

      pdf.save(`${resultData.quizTitle}_Result.pdf`);
    });
  };

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
    <Box className={styles.quizResult} ref={resultRef}>
      <Box className={styles.header}>
        <Text style={{ fontSize: "34px" }} className={styles.title}>
          {quizTitle} – Result
        </Text>
        <Button
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={handleDownloadPdf}
        >
          Download Result
        </Button>
      </Box>

      <Box className={styles.profileSection}>
        <Flex className={styles.profileInfo}>
          <Image
            src={image?.url}
            alt="Student profile"
            className={styles.profilePic}
          />
          <Box className={styles.profileDetails}>
            <Text style={{ fontSize: "28px" }} className={styles.text}>
              {studentFirstName} {studentLastName}
            </Text>
            <Text className={styles.text}>
              <strong>Student ID:</strong> {studentId}
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
