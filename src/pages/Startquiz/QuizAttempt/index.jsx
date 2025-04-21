import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { quizService } from "@/services/quizService";
import styles from "./QuizAttempt.module.scss";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useToast,
  Text,
  Spinner,
} from "@chakra-ui/react";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [resultError, setResultError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getById(quizId);
        setQuiz(data);
        setLoading(false);
      } catch {
        toast({
          title: "Failed to load quiz.",
          status: "error",
          isClosable: true,
        });
      }
    };
    fetchQuiz();
  }, [quizId, toast]);

  const startQuiz = async () => {
    try {
      const attempt = await quizService.startAttempt(quizId);
      setQuiz(attempt);
      setStarted(true);
    } catch {
      toast({
        title: "Failed to start quiz.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = async () => {
    const currentAnswer = {
      questionVersionId: currentQuestion.id,
      answerContent: answers[currentQuestion.id] || "",
    };

    try {
      console.log("Submitting payload:", currentAnswer);

      await quizService.submitResponses(quizId, currentAnswer);

      if (currentIndex === questions.length - 1) {
        await quizService.finishAttempt(quizId);

        const resultData = await quizService.getResult(quizId);
        setResult(resultData);
        setResultError(null);

        toast({
          title: "Quiz submitted successfully!",
          status: "success",
          isClosable: true,
        });
      } else {
        // Move to the next question
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex < questions.length) {
            return nextIndex;
          } else {
            return prev;
          }
        });
      }
    } catch (error) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.message === "Results have not been revealed yet."
      ) {
        setResultError(
          "The results have not been revealed yet. Please check back later."
        );
      } else {
        console.error(error);
        toast({
          title: "Failed to submit answer.",
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  if (loading || !quiz) {
    return (
      <Box className={styles.loading}>
        <Spinner size="xl" />
      </Box>
    );
  }

  const questions =
    quiz?.questions ||
    quiz?.quizVersion?.questionVersions ||
    quiz?.quizVersions?.[0]?.questionVersions ||
    [];

  const currentQuestion = questions[currentIndex];

  return (
    <Box className={styles.quizAttempt}>
      <Box className={styles.content}>
        {!started ? (
          <Button colorScheme="teal" onClick={startQuiz}>
            Start Quiz
          </Button>
        ) : result ? (
          <Box className={styles.result}>
            <Text className={styles.resultTitle}>Quiz Result</Text>
            <Text>Your score: {result.score}</Text>

            <Button onClick={() => setStarted(false)} colorScheme="blue">
              Start New Quiz
            </Button>
          </Box>
        ) : resultError ? (
          <Box className={styles.resultError}>
            <Text>{resultError}</Text>
            <Button onClick={() => setStarted(false)} colorScheme="blue">
              Try Again Later
            </Button>
          </Box>
        ) : (
          <>
            <Box className={styles.mainCard}>
              <Text className={styles.questionTitle}>
                Question {currentIndex + 1}
              </Text>
              <Box className={styles.questionText}>
                {currentQuestion?.content || currentQuestion?.questionText}
              </Box>

              <Box className={styles.typeLabel}>
                {currentQuestion?.questionType?.replace("_", " ")}
              </Box>

              <Box className={styles.answerBlock}>
                {currentQuestion?.questionType === "SHORT_ANSWER" && (
                  <Textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestion.id, e.target.value)
                    }
                    placeholder="Type your answer..."
                  />
                )}

                {currentQuestion?.questionType === "MULTIPLE_CHOICE" && (
                  <RadioGroup
                    onChange={(val) =>
                      handleAnswerChange(currentQuestion.id, val)
                    }
                    value={answers[currentQuestion.id] || ""}
                  >
                    <Stack direction="column">
                      {(currentQuestion.options || []).map((opt) => (
                        <Radio
                          key={opt.id}
                          value={opt.text || opt.id}
                          className={styles.radio}
                        >
                          {opt.content || opt.text}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                )}

                {currentQuestion?.questionType === "TRUE_FALSE" && (
                  <RadioGroup
                    onChange={(val) =>
                      handleAnswerChange(currentQuestion.id, val)
                    }
                    value={answers[currentQuestion.id] || ""}
                  >
                    <Stack direction="row">
                      <Radio value="true">True</Radio>
                      <Radio value="false">False</Radio>
                    </Stack>
                  </RadioGroup>
                )}
              </Box>

              <Box className={styles.pointsSection}>
                <Text>Point</Text>
                <input type="text" value="1" readOnly />
              </Box>

              <Box className={styles.navButtons}>
                <Button
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  isDisabled={currentIndex === 0}
                >
                  Previous
                </Button>

                {currentIndex === questions.length - 1 ? (
                  <Button
                    colorScheme="blue"
                    isDisabled={
                      Object.keys(answers).length !== questions.length
                    }
                    onClick={handleNext}
                  >
                    Finish
                  </Button>
                ) : (
                  <Button colorScheme="blue" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </Box>

            <Box className={styles.questionList}>
              {questions.map((q, i) => (
                <Box
                  key={q.id}
                  className={`${styles.questionItem} ${
                    i === currentIndex ? styles.active : ""
                  } ${answers[q.id] ? styles.answered : ""}`}
                  onClick={() => setCurrentIndex(i)}
                >
                  <Text>Question {i + 1}</Text>
                  <Text className={styles.truncate}>
                    {(q.content || q.questionText).slice(0, 30)}...
                  </Text>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default QuizAttempt;
